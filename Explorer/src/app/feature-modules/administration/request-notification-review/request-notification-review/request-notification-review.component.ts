import { Component, OnInit } from '@angular/core';
import { RequestNotification } from '../../model/request-notification.model';
import { AdministrationService } from '../../administration.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-request-notification-review',
  templateUrl: './request-notification-review.component.html',
  styleUrls: ['./request-notification-review.component.css']
})
export class RequestNotificationReviewComponent implements OnInit{

  user: User | undefined;
  allUnreadNotifications: RequestNotification[] = []

  constructor(private adminService: AdministrationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getAllUnreadNotifications(user.id);
    });
  }

  getAllUnreadNotifications(userId: number): void {
    this.adminService.getAllUnreadRequestNotifications(userId).subscribe({
      next: (notifications: RequestNotification[]) => {
          this.allUnreadNotifications = notifications;
      },
      error: () => {
          // Handle errors
      }
  });
  }

  markAsRead(not: RequestNotification) {
    this.adminService.markAsReadRequestNotification(not.id).subscribe({
      next: (notification: RequestNotification) => {
          this.allUnreadNotifications.length = 0;
          this.getAllUnreadNotifications(not.userId);
      },
      error: () => {
          // Handle errors
      }
  });
  }
}
