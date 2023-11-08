import { Component, OnInit } from '@angular/core';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AdministrationService } from '../administration.service';
import { ReportedIssueNotification } from '../model/reported-issue-notification.model';

@Component({
  selector: 'xp-reported-issue-notifications',
  templateUrl: './reported-issue-notifications.component.html',
  styleUrls: ['./reported-issue-notifications.component.css'],
  providers: [DatePipe]
})
export class ReportedIssueNotificationsComponent implements OnInit {
  notifications: ReportedIssueNotification[];
  unread: ReportedIssueNotification[];
  user:User;
  role: string;
  selectedNotification:ReportedIssueNotification;

  constructor(private service: AdministrationService, private authService: AuthService) { }
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.role = this.user.role
    });
    this.getAllByUser();
    this.getUnreadByUser();
  }

  getAllByUser(): void{
    this.service.getAllReportedIssueNotificationsByUser(this.user.id, this.role).subscribe({
      next: (result: PagedResults<ReportedIssueNotification>) => {
        this.notifications = result.results;
        },
        error: () => {
        }
    })
  }

  getUnreadByUser(): void{
    this.service.getUnreadReportedIssueNotificationsByUser(this.user.id, this.role).subscribe({
      next: (result: PagedResults<ReportedIssueNotification>) => {
        this.unread = result.results;
        },
        error: () => {
        }
    })
  }
  
  deleteNotification(id: number): void {
    this.service.deleteReportedIssueNotification(id, this.role).subscribe({
      next: () => {
        this.getAllByUser();
        this.getUnreadByUser();
      },
    })
  }

  markAsRead(notification: ReportedIssueNotification): void {
    notification.isRead = true;
    this.service.updateReportedIssueNotification(this.role, notification).subscribe({
      next: () => {
        this.getAllByUser();
        this.getUnreadByUser();
      },
    })
  }

  // getNotification(id: number): void {
  //   this.service.getReportedIssueNotification(id, this.role).subscribe({
  //     next: (result: ReportedIssueNotification) => {
  //       this.selectedNotification = result;
  //       },
  //       error: () => {
  //       }
  //     })
  // }

  selectNotification(notif: ReportedIssueNotification): void {
    this.selectedNotification = notif;
  }

}