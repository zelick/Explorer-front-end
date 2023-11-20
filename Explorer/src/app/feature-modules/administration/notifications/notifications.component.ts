import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { Notification } from '../model/notification.model';

@Component({
  selector: 'xp-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'], 
  providers: [DatePipe]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[];
  numberAll: number;
  unread: Notification[];
  numberNew: number;
  user: User;
  selectedNotification:Notification;
  hasNew: boolean = true;

  constructor(
    private service: AdministrationService, private authService: AuthService) { }
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getAllByUser();
    this.getUnreadByUser();
  }

  getAllByUser(): void{
    this.service.getAllNotificationsByUser(this.user.id, this.user.role).subscribe({
      next: (result: PagedResults<Notification>) => {
        this.notifications = result.results;
        // Sort the notifications, sort by isRead in descending order (false comes first). 
        // If both have the same isRead status, sort by creationTime in descending order
        this.notifications.sort((a, b) => {
          if (a.isRead === b.isRead) {  
            return new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime();
          } else if (a.isRead) {
            return 1;
          } else {
            return -1;
          }
        });
        this.numberAll = this.notifications.length;
        },
        error: () => {
        }
    })
  }

  getUnreadByUser(): void{
    this.service.getUnreadNotificationsByUser(this.user.id, this.user.role).subscribe({
      next: (result: PagedResults<Notification>) => {
        this.unread = result.results;
        // Sort the notifications by creationTime in descending order
        this.unread.sort((a, b) => {
          return new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime();
        });
        this.numberNew = this.unread.length;
        if (this.unread.length == 0){
          this.hasNew = false;
        }
        },
        error: () => {
        }
    })
  }
  
  deleteNotification(id: number): void {
    this.service.deleteNotification(id, this.user.role).subscribe({
      next: () => {
        this.getAllByUser();
        this.getUnreadByUser();
      },
    })
  }

  dismissOne(notification: Notification): void {
    notification.isRead = true;
    this.service.updateNotification(this.user.role, notification).subscribe({
      next: () => {
        this.getAllByUser();
        this.getUnreadByUser();
      },
    })
  }

  dismissAll(): void {
    this.notifications.forEach(element => {
      this.dismissOne(element);
    });  
    this.getAllByUser();
    this.getUnreadByUser();
  }

  selectNotification(notif: Notification): void {
    this.selectedNotification = notif;
  }

  messageNotificationType(notif: Notification): boolean{
    return notif.type.toString().includes('MESSAGE');
  }
  
  reportedIssueNotificationType(notif: Notification): boolean{
    return notif.type.toString().includes('REPORTED_ISSUE');
  }

  requestNotificationType(notif: Notification): boolean{
    return notif.type.toString().includes('REQUEST');
  }
}
