import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { ProfileInfo } from './model/profileInfo.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { TourPreview } from '../marketplace/model/tour-preview';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private apiUrl2 = 'https://nominatim.openstreetmap.org/reverse?format=json';

  constructor(private http: HttpClient, private authService: AuthService, private tokenStorage: TokenStorage) { }

  fetchCurrentUser(): Observable<any> {
    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const personId = jwtHelperService.decodeToken(accessToken).id;
    if (personId) {
      return this.http.get(environment.apiHost + `profile-administration/edit/${personId}`);
    }
    return of(null); 
  }

  saveNewInfo(profileInfo: ProfileInfo, formData: FormData): Observable<any> {
    const options = { headers: new HttpHeaders() };

    formData.append('id', profileInfo.id.toString());
  formData.append('userId', profileInfo.userId.toString());
  formData.append('name', profileInfo.name);
  formData.append('surname', profileInfo.surname);
  formData.append('email', profileInfo.email);
  formData.append('biography', profileInfo.biography);
  formData.append('motto', profileInfo.motto);

  // Assuming that profilePicture is a File
  if (profileInfo.profilePicture instanceof File) {
    formData.append('profilePicture', profileInfo.profilePicture, profileInfo.profilePicture.name);
  }

  // Assuming profilePictureUrl is a string
  formData.append('profilePictureUrl', profileInfo.profilePictureUrl);

  return this.http.put(environment.apiHost + 'profile-administration/edit', formData, options);
  
}

  getPlaceInfo(latitude: number, longitude: number): Observable<any> {
    const url = `${this.apiUrl2}&lat=${latitude}&lon=${longitude}`;

    return this.http.get(url);
  }

  getAllTours():  Observable<PagedResults<TourPreview>>{
    return this.http.get<PagedResults<TourPreview>>('https://localhost:44333/api/langing-page/get-all-tours-preview');
  }
  
}