import { Component, OnInit, Inject } from '@angular/core';
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
  providers: [DatePipe],
})
export class ReportedIssueNotificationsComponent implements OnInit {
  notifications: ReportedIssueNotification[];
  numberAll: number;
  unread: ReportedIssueNotification[];
  numberNew: number;
  user: User;
  selectedNotification:ReportedIssueNotification;
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
    this.service.getAllReportedIssueNotificationsByUser(this.user.id, this.user.role).subscribe({
      next: (result: PagedResults<ReportedIssueNotification>) => {
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
    this.service.getUnreadReportedIssueNotificationsByUser(this.user.id, this.user.role).subscribe({
      next: (result: PagedResults<ReportedIssueNotification>) => {
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
    this.service.deleteReportedIssueNotification(id, this.user.role).subscribe({
      next: () => {
        this.getAllByUser();
        this.getUnreadByUser();
      },
    })
  }

  // TODO - go to the reported issues page and see the chat for the issue that notification is reffering to
  seeDetails(notification: ReportedIssueNotification): void {
    // dismiss notification when you see details
    this.dismissOne(notification);
    // TODO
    // if (this.user.role == 'tourist'){
    //   this.service.getTouristsReportedIssues(notification.reportedIssueId).subscribe();
    // } else {
    //   this.service.getAuthorsReportedIssues(notification.reportedIssueId).subscribe();
    // }
  }

  dismissOne(notification: ReportedIssueNotification): void {
    notification.isRead = true;
    this.service.updateReportedIssueNotification(this.user.role, notification).subscribe({
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

  // getNotification(id: number): void {
  //   this.service.getReportedIssueNotification(id, this.user.role).subscribe({
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