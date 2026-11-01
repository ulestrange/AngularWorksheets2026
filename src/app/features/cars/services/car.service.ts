import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, throwError } from 'rxjs';
import { Car, CreateCarDto } from '../models/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {


  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3006/api/v1/cars'; // this should be read from an env variable we will leave it for now.

getCars(): Observable<Car[]> {
  return this.http
    .get<Car[]>(this.apiUrl)
    .pipe(catchError((err) => this.handleError(err)));
}


  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`)
     .pipe(catchError((err) => this.handleError(err)));
  }

  addCar(car: CreateCarDto): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car)
      .pipe(
        catchError((err) => this.handleError(err))
      )
  }


  private handleError(error: HttpErrorResponse): Observable<never> {

    let message: string;

    switch (error.status) {
      case 0:
        message = 'Cannot reach the server. Check that the API is running.';
        break;
      case 400:
        message = 'Some of the data was not valid.';
        break;
      case 401:
        message = 'Please log in to continue.';
        break;
      case 403:
        message = 'You are not allowed to do that.';
        break;
      case 404:
        message = 'That car could not be found.';
        break;
      default:
        message = 'Something went wrong on the server. Please try again later.';
    }

    // Full details for the developer, a short message for the user
    console.error(`HTTP ${error.status} from ${error.url}`, error);
    console.log('message for user:', message);
    return throwError(() => new Error(message));
  }


  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     The backend returned an unsuccessful response code.
  //     The response body may contain clues as to what went wrong.

  //     if (error.status == 401 || error.status == 403) {

  //       console.error('authorisation issue ' , error.status );
  //        return throwError(() => new Error('You are not authorised for that action'));

  //     }
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `, error.error);
  //   }
  //   Return an observable with a user-facing error message.
  //   return throwError(() => new Error('Something bad happened; please try again later.'));
  // }

}