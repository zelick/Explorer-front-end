import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SocialProfile } from '../model/social-profile.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserSocialProfileService } from '../user-social-profile.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
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
  inbox: Message[];
  sent: Message[];
  activeTab: string = 'profile';
  isMessageBoxActive: boolean = false;

  selectedRecipientId: number;
  messageTitle: string;
  messageContent: string;

  constructor(private service: UserSocialProfileService, 
    private authService: AuthService) { }

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

  onFollowClick(followedId?: number): void {
    if(this.user && followedId){
      this.service.follow(this.user.id, followedId).subscribe((result: SocialProfile) => {
        this.socialProfile = result;
      });
    }
  }

  onUnfollowClick(followedId?: number): void {
    if(this.user && followedId){
      this.service.unfollow(this.user.id, followedId).subscribe((result: SocialProfile) => {
        this.socialProfile = result;
      });
    }
  }

  onProfileTabClick(): void {
    this.activeTab = "profile";
  }

  onNotificatioTabClick(): void {
    this.activeTab = "notification";
    if(this.user) {
      this.getNotifications();
    }
  }

  onInboxTabClick(): void {
    this.activeTab = "inbox";
    if(this.user) {
      this.getInbox();
    }
  }

  onSentTabClick(): void {
    this.activeTab = "sent";
    if(this.user) {
      this.getSent();
    }
  }

  onComposeTabClick(): void {
    this.activeTab = "compose"
  }

  getNotifications(): void {
    if(this.user) {
      this.service.getNotifications(this.user.id).subscribe((result: Message[]) => {
        this.notifications = result;
      });
    }
  }

  getInbox(): void {
    if(this.user) {
      this.service.getNotifications(this.user.id).subscribe((result: Message[]) => {
        this.inbox = result;
      });
    }
  }

  getSent(): void {
    if(this.user) {
      this.service.getSent(this.user.id).subscribe((result: Message[]) => {
        this.sent = result;
      });
    }
  }

  sendMessage(): void {
    if(this.user) {
      const message: Message = {
        id: 0,
        senderId: this.user.id,
        recipientId: this.selectedRecipientId,
        senderUsername: this.user.username,
        title: this.messageTitle,
        sentDateTime: new Date(),
        readDateTime: new Date(),
        content: this.messageContent,
        isRead: false,
      };
      this.service.sendMessage(message).subscribe(() => {
      this.selectedRecipientId = 0;
      this.messageTitle = '';
      this.messageContent = '';
      this.onSentTabClick();
    });
    } 
  }

  readMessage(id: number): void {
    if(this.user) {
      this.service.markAsRead(id).subscribe((result: Message) => {
        
      });
    }
  }
}
