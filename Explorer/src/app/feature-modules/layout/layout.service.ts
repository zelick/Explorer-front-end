import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ProfileInfo } from './model/profileInfo.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchCurrentUser(): Observable<any> {
    const personId = this.authService.getPersonIdFromToken();
    if (personId) {
      return this.http.get(environment.apiHost + `profile-administration/edit/${personId}`);
    }
    return of(null); 
  }

  saveNewInfo(profileInfo: ProfileInfo): Observable<any> {
    return this.http
    .put(environment.apiHost + 'profile-administration/edit', profileInfo)
  }
}