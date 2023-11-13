import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SocialProfile } from '../model/social-profile.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserSocialProfileService } from '../user-social-profile.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../../administration/administration.service';
import { Message } from '../model/message.model';

@Component({
  selector: 'xp-social-profile',
  templateUrl: './social-profile.component.html',
  styleUrls: ['./social-profile.component.css']
})
export class SocialProfileComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  user: User | undefined;
  socialProfile: SocialProfile;
  notifications: Message[];
  activeTab: string = 'profile';

  constructor(private service: UserSocialProfileService, 
    private authService: AuthService,
    private administrationService: AdministrationService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getSocialProfile(this.user.id)
    });
  }

  getSocialProfile(id: number): void {
    this.service.getSocilaProfile(id).subscribe((result: SocialProfile) => {
      this.socialProfile = result;
    });
  }

  onProfileTabClick(): void {
    this.activeTab = "profile";
  }

  onNotificatioTabClick(): void {
    this.activeTab = "notification";
    if(this.user) {
      this.getNotifications(this.user.id);
    }
  }

  onInboxTabClick(): void {
    this.activeTab = "inbox";
  }

  onSentTabClick(): void {
    this.activeTab = "sent";
  }

  getNotifications(id: number): void {
    this.service.getNotifications(id).subscribe((result: Message[]) => {
      this.notifications = result;
    });
  }

}
