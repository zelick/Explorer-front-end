import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenStorage } from './jwt/token.service';
import { environment } from 'src/env/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Login } from './model/login.model';
import { AuthenticationResponse } from './model/authentication-response.model';
import { User } from './model/user.model';
import { Registration } from './model/registration.model';
import { SecureToken } from './model/secure-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "" });

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorage,
    private router: Router) { }

  login(login: Login): Observable<AuthenticationResponse> {
    return this.http
      .post<AuthenticationResponse>(environment.apiHost + 'users/login', login)
      .pipe(
        tap((authenticationResponse) => {
          this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
          this.setUser();
        })
      );
  }

  register(formData: FormData): Observable<AuthenticationResponse> {
    const headers = new HttpHeaders();
  
    return this.http.post<AuthenticationResponse>(
      environment.apiHost + 'users',
      formData,
      { headers }
    )/*.pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
      })
    );*/
  }
  
  logout(): void {
    this.router.navigate(['/home']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next({username: "", id: 0, role: "" });
      }
    );
  }

  checkIfUserExists(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    if (accessToken == null) {
      return;
    }
    this.setUser();
  }

  private setUser(): void {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const user: User = {
      id: +jwtHelperService.decodeToken(accessToken).id,
      username: jwtHelperService.decodeToken(accessToken).username,
      role: jwtHelperService.decodeToken(accessToken)[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ],
    };
    this.user$.next(user);
  }
  
  getAccessToken(): string | null {
    const token = this.tokenStorage.getAccessToken(); 
  
    return token || null;
  }

  isUserVerified(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'users/verificationStatus/' + username)
  }

  sendPasswordResetEmail(username: string): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'users/send-password-reset-email/' + username)
  }

  updatePassword(username: string, password: string): Observable<User> {
    return this.http.put<User>(environment.apiHost + 'user/update-password/' + username + '/' + password, null)
  }

  getSecureToken(username: string): Observable<SecureToken> {
    return this.http.get<SecureToken>(environment.apiHost + 'secureTokens/get-secure-token/' + username)
  }

  getUserIdByTokenData(tokenData: string): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'secureTokens/get-user-id/' + tokenData)
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(environment.apiHost + 'user/get-user-by-id/' + userId)
  }

}