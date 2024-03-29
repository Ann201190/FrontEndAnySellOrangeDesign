import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AUTH_API_URL } from '../app-injection-tokens';
import { Token } from '../models/token';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';

export const ACCESS_TOKEN_KEY = 'backendanysell_access_token'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(AUTH_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private storage: LocalStorageService
  ) { }

  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}api/auth/login`, {
      email, password
    }).pipe(
      tap(token => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token)
      }))
  }

  isAuthenticated(): boolean {
   // localStorage.clear();
    var token = localStorage.getItem(ACCESS_TOKEN_KEY);
    console.log("token");
    console.log(token);

    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.storage.removeItem('storeId');
    this.storage.removeItem('storeName');
    this.storage.removeItem('logoImage');
    this.storage.removeItem('email');
    this.router.navigate([''])
  }

  registrationManager(email: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}api/registration/registrationmanager`, { email, password })
  }

  registrationCashier(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}api/registration/registrationcashier`, { email })
  }

  confirm(stringConfirm: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}api/auth/confirm/${stringConfirm}`);
  }

  changePassword(password: any): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}api/registration/changepassword`, { currentPassword: password.currentPassword, newPassword: password.newPassword })
  }
}
