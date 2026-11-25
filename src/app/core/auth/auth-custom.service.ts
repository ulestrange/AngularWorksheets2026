import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../../environments/environment';
import { LoginUserDto, RegisterUserDto, User } from '../models/user';
import { Router } from '@angular/router';
import { Observable, finalize, map, shareReplay, tap } from 'rxjs';


interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthCustomService {

private readonly apiUrl = `${environment.apiUri}/auth`

  private http = inject(HttpClient);
  private router = inject(Router);

  // private, writable state: only this service can change it
  private readonly _token = signal<string | null>(null);
  private readonly _currentUser = signal<User | null>(null);

  // public, read-only state for components to use
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

 // private expiryTimer?: ReturnType<typeof setTimeout>;

  private refreshTimer?: ReturnType<typeof setTimeout>;

    // if several requests get a 401 at the same time we only want ONE refresh call,
  // so we keep the refresh that is in progress and hand it to everyone who asks
  private refreshInProgress$?: Observable<string>;

  get token(): string | null {
    return this._token();
  }


  addUser(user: RegisterUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }


  login(userCredentials: LoginUserDto): Observable<User> {
    return this.http
      // withCredentials lets the browser store the refresh-token cookie
      // that the API (a different origin: port 3006) sends back

      .post<AuthResponse>(`${this.apiUrl}/login`,  userCredentials, { withCredentials: true } )
      .pipe(
        tap(res => {
          // this._token.set(res.token);
          // this._currentUser.set(res.user);
          // this.startExpiryTimer(res.token);
          this.setSession(res)
        }),
        map(res => res.user)
      );
  }

  logout(): void {
   // clearTimeout(this.expiryTimer);
    // this._token.set(null);
    
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({ error: () => {} });

    this.clearSession();

     this.router.navigate(['/login']);
  }


  // private startExpiryTimer(token: string): void {
  //   // the payload is readable by anyone: never put secrets in it
  //   const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  //   const payload = JSON.parse(atob(base64));
  //   const msLeft = payload.exp * 1000 - Date.now();

  //   clearTimeout(this.expiryTimer);
  //   this.expiryTimer = setTimeout(() => this.logout(), msLeft);
  // }

  // Instead of logging the user out when the access token expires,
  // get a new one shortly before it expires.
  private scheduleRefresh(token: string): void {
    // the payload is readable by anyone: never put secrets in it
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const msLeft = payload.exp * 1000 - Date.now();
    const refreshIn = Math.max(msLeft - 30_000, 0); // 30 seconds early

    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => {
      this.refresh().subscribe({ error: () => this.logout() });
    }, refreshIn);
  }

  private setSession(res: AuthResponse): void {
    this._token.set(res.token);
    this._currentUser.set(res.user);
    this.scheduleRefresh(res.token);
  }

    private clearSession(): void {
    clearTimeout(this.refreshTimer);
    this._token.set(null);
    this._currentUser.set(null);
  }


  // Swap the refresh-token cookie for a new access token.
  // Returns the new access token so the interceptor can retry the failed request.
  refresh(): Observable<string> {
    if (!this.refreshInProgress$) {
      this.refreshInProgress$ = this.http
        .post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
        .pipe(
          tap(res => this.setSession(res)),
          map(res => res.token),
          finalize(() => (this.refreshInProgress$ = undefined)),
          shareReplay(1)
        );
    }
    return this.refreshInProgress$;
  }

}