import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthCustomService } from '../auth/auth-custom.service';
import { environment } from '../../../environments/environment';


// this function will check if a token exists and if so will return a new requst with the
// token attached as a bearer token

function withToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
}


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthCustomService);



  const jwt = authService.token;

  // we don't want to attach our token to a request to any other server
  // so if the request is not to our server we just call next


 if (! req.url.startsWith(environment.apiUri) ) {
  return next(req)
 }
 


  // login, register, refresh and logout must not trigger a refresh:
  // a 401 from login just means a wrong password,
  // and a 401 from refresh would send us round in a loop
 
  const isAuthCall = req.url.startsWith(`${environment.apiUri}/auth/`);


    return next(withToken(req, authService.token)).pipe(
      catchError((err) => {
        console.log('Request failed ' + err.status);


      // Handle missing or invalid JWT (401)
      // this is handled differently if the request was to one of the /auth routes

      if (err.status != 401  && !isAuthCall ) {
         // The access token has expired (or is missing).
      // Try to get a new one with the refresh token, then send the request again.
      return authService.refresh().pipe(
        catchError(() => {
          // the refresh token has expired too, so the user has to log in again
          authService.logout();
          return throwError(() => err);
        }),
        switchMap(newToken => next(withToken(req, newToken)))
      );
      }

        return throwError(() => err);
      })
    );

}