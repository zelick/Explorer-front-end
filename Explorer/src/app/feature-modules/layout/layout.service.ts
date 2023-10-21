import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  fetchCurrentUser(): void {
    const personId = this.authService.getPersonIdFromToken();
    
    if (personId) {
      this.http.get(`/api/users/${personId}`).subscribe((user) => {
        
      });
    }
  }
}