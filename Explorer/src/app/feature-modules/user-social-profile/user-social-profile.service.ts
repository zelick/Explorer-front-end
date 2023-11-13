import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocialProfile } from './model/social-profile.model';
import { environment } from 'src/env/environment';
import { Message } from './model/message.model';

@Injectable({
  providedIn: 'root'
})
export class UserSocialProfileService {
  [x: string]: any;

  constructor(private http: HttpClient) { }

  getSocilaProfile(id: number): Observable<SocialProfile> {
    return this.http.get<SocialProfile>(environment.apiHost + 'profile-messaging/get-user-social-profile/' + id);
  }

  getNotifications(id: number): Observable<Message[]> {
    return this.http.get<Message[]>(environment.apiHost + 'profile-messaging/get-notifications/' + id);
  }

  markAsRead(id: number): Observable<Message> {
    return this.http.post<Message>(environment.apiHost + 'profile-messaging/mark-as-read/' + id, null);
  }

}
