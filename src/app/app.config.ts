import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthInterceptor } from './core/interceptors/auth-interceptor';
import { AuthCustomService } from './core/auth/auth-custom.service';
import { catchError, of } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([errorInterceptor, AuthInterceptor])),
        // On startup, try to swap the refresh cookie for an access token.
    // Success: setSession() fills in the token and currentUser.
    // Failure (no cookie / expired): carry on logged out, don't crash the app.
    provideAppInitializer(() => {
      const auth = inject(AuthCustomService);
      return auth.refresh().pipe(catchError(() => of(null)));
    }),
  ]
};
