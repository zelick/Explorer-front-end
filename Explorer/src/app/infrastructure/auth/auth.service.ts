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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$ = new BehaviorSubject<User>({username: "", id: 0, role: "", isVerified: false});
  verified: boolean = false;

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
    ).pipe(
      tap((authenticationResponse) => {
        this.tokenStorage.saveAccessToken(authenticationResponse.accessToken);
        this.setUser();
      })
    );
  }
  
  logout(): void {
    this.router.navigate(['/home']).then(_ => {
      this.tokenStorage.clear();
      this.user$.next({username: "", id: 0, role: "", isVerified: false });
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

  // Koristi isUserVerified da proveri stvarni status verifikacije
  this.isUserVerified(+jwtHelperService.decodeToken(accessToken).id).subscribe((verified: boolean) => {
    // Dodajte proveru da li korisnik još uvek čeka verifikaciju
    if (this.user$.getValue().isVerified !== verified) {
      const user: User = {
        id: +jwtHelperService.decodeToken(accessToken).id,
        username: jwtHelperService.decodeToken(accessToken).username,
        role: jwtHelperService.decodeToken(accessToken)[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ],
        isVerified: verified
      };
      this.user$.next(user);
    }
  });
}
  
  getAccessToken(): string | null {
    const token = this.tokenStorage.getAccessToken(); 
  
    return token || null;
  }

  isUserVerified(id: number): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'users/verificationStatus/' + id).pipe(
      tap((status: boolean) => {
        this.verified = status;
  
        if (this.verified) {
          const jwtHelperService = new JwtHelperService();
          const accessToken = this.tokenStorage.getAccessToken() || "";
          const user: User = {
            id: +jwtHelperService.decodeToken(accessToken).id,
            username: jwtHelperService.decodeToken(accessToken).username,
            role: jwtHelperService.decodeToken(accessToken)[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ],
            isVerified: true
          };
          this.user$.next(user);
        }
      })
    );
  }
}