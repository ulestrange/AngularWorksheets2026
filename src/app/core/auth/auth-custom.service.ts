import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../../environments/environment';
import { RegisterUserDto, User } from '../models/user';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';


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

  private expiryTimer?: ReturnType<typeof setTimeout>;

  get token(): string | null {
    return this._token();
  }


  addUser(user: RegisterUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }


  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          this._token.set(res.token);
          this._currentUser.set(res.user);
          this.startExpiryTimer(res.token);
        }),
        map(res => res.user)
      );
  }

  logout(): void {
    clearTimeout(this.expiryTimer);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }


  private startExpiryTimer(token: string): void {
    // the payload is readable by anyone: never put secrets in it
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const msLeft = payload.exp * 1000 - Date.now();

    clearTimeout(this.expiryTimer);
    this.expiryTimer = setTimeout(() => this.logout(), msLeft);
  }


}