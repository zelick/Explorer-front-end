import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ApplicationGrade } from './model/applicationGrade.model';
import { ClubMemebrshipRequest } from './model/club-membership-request.model';
import { Club } from './model/club.model';
import { Account } from './model/account.model';
import { ReportedIssue } from './model/reported-issue.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { UserClub } from './model/user-club.model';
import { ClubInvitation } from './model/club-invitation.model';
import { TourIssueComment } from '../tour-authoring/model/tour-issue-comment';
import { CheckpointRequest } from './model/checkpoint-request.model';
import { ObjectRequest } from './model/object-request.model';
import { Notification } from './model/notification.model';

//TODO
import { RequestNotification } from './model/request-notification.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  [x: string]: any;

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  getAllGrades(): Observable<ApplicationGrade[]> {
    return this.http.get<ApplicationGrade[]>(environment.apiHost + 'administration/applicationGrade');
  }

  noteTheRate(grade: ApplicationGrade): Observable<ApplicationGrade> {
    return this.http.post<ApplicationGrade>(environment.apiHost + 'tour/applicationGrade', grade);
  }

  //club membership requests
  getClubMembershipRequests(): Observable<PagedResults<ClubMemebrshipRequest>> {
    return this.http.get<PagedResults<ClubMemebrshipRequest>>('https://localhost:44333/api/request')
  }
  
  acceptRequest(r: ClubMemebrshipRequest): Observable<ClubMemebrshipRequest> {
    r.status = "Accepted";
    return this.http.put<ClubMemebrshipRequest>('https://localhost:44333/api/request/' + r.id, r);
  }

  rijectRequest(r: ClubMemebrshipRequest): Observable<ClubMemebrshipRequest> {
    r.status = "Rijected";
    return this.http.put<ClubMemebrshipRequest>('https://localhost:44333/api/request/' + r.id, r);
  }

  createRequest(newClubRequest: ClubMemebrshipRequest): Observable<ClubMemebrshipRequest> {
    return this.http.post<ClubMemebrshipRequest>('https://localhost:44333/api/request', newClubRequest);
  }

  deleteRequest(id: number): Observable<ClubMemebrshipRequest> {
    return this.http.delete<ClubMemebrshipRequest>('https://localhost:44333/api/request/deleteRequest/' + id);
  }

  //club
  getClub(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>('https://localhost:44333/api/club');
  }

  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>('https://localhost:44333/api/club', club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>('https://localhost:44333/api/club/' + club.id, club);
  }

  deleteClub(id: number): Observable<Club> {
    return this.http.delete<Club>('https://localhost:44333/api/club/' + id);
  }
  
  getClubWithUsers(clubId : number): Observable<Club> {
    return this.http.get<Club>('https://localhost:44333/api/club/' + clubId);
  }

  
  getUserClubs(userId: number): Observable<Club[]> {
    return this.http.get<Club[]>('https://localhost:44333/api/user-club/user/' + userId);
  }

  //userClub 
  joinUserToClub(memberId: number, clubId: number): Observable<Club> {
    return this.http.put<Club>('https://localhost:44333/add-to/' + clubId + '/' + memberId, null);
  } 

  getAccounts(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/accountsManagement')
  }

  block(id: number): Observable<PagedResults<Account>> {
    return this.http.put<PagedResults<Account>>(environment.apiHost + 'administration/accountsManagement/block/' + id, null);
  }

  // ReportedIssues
  addDeadline(id: number, date: Date): Observable<ReportedIssue> {
    return this.http.put<ReportedIssue>(environment.apiHost + 'administration/reportedIssues/deadline/' + id, date);
  }

  penalize(id: number): Observable<ReportedIssue> {
    return this.http.put<ReportedIssue>(environment.apiHost + 'administration/reportedIssues/penalizeAuthor/' + id, null);
  }

  closeReportedIssue(id: number): Observable<ReportedIssue> {
    return this.http.put<ReportedIssue>(environment.apiHost + 'administration/reportedIssues/closeReportedIssue/' + id, null);
  }
  
  getReportedIssues(): Observable<PagedResults<ReportedIssue>>{
    return this.http.get<PagedResults<ReportedIssue>>(environment.apiHost + 'administration/reportedIssues');
  }

  getAuthorsReportedIssues(id:number): Observable<PagedResults<ReportedIssue>>{
    return this.http.get<PagedResults<ReportedIssue>>(environment.apiHost + `author/reported-issue-response/${id}`);
  }

  getTouristsReportedIssues(id:number): Observable<PagedResults<ReportedIssue>>{
    return this.http.get<PagedResults<ReportedIssue>>(environment.apiHost + `tourist/reportingIssue/${id}`);
  }

  addAdministratorCommentOnReportedIssue(id: number, comment: TourIssueComment): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(`https://localhost:44333/api/administration/reportedIssues/comment/${id}`, comment);
  }

  resolveReportedIssue(id: number): Observable<ReportedIssue> {
    return this.http.put<ReportedIssue>(environment.apiHost + `tourist/reportingIssue/resolve/${id}`,null);
  }

  addTouristCommentOnReportedIssue(id: number, comment: TourIssueComment): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + `tourist/reportingIssue/comment/${id}`, comment);
  }

  addAuthorCommentOnReportedIssue(id: number, comment: TourIssueComment): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + `author/reported-issue-response/response/${id}`, comment);
  }
  
 

  getUsersForClub(id: number): Observable<Club> {
    return this.http.get<Club>('https://localhost:44333/api/club/' + id);
  }

  removeMemberFromClub(memberId: number, clubId: number): Observable<Club> {
    return this.http.put<Club>('https://localhost:44333/remove-from/' + clubId + '/' + memberId, null);
  }

  addMemberToClub(memberId: number, clubId: number): Observable<Club> {
    return this.http.put<Club>('https://localhost:44333/add-to/' + clubId + '/' + memberId, null);
  }
  
  addClubInvitation(clubInvitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.post<ClubInvitation>('https://localhost:44333/api/club-invitation', clubInvitation);
  }

  getClubInvitations(): Observable<PagedResults<ClubInvitation>> {
    return this.http.get<PagedResults<ClubInvitation>>('https://localhost:44333/api/club-invitation');
  }

  updateClubInvitation(clubInvitation: ClubInvitation): Observable<ClubInvitation> {
    return this.http.put<ClubInvitation>('https://localhost:44333/api/club-invitation/' + clubInvitation.id, clubInvitation);
  }

  getAllUsers(): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>('https://localhost:44333/api/user');
  }

  //checkpoint requests
  getAllCheckpointRequests(): Observable<CheckpointRequest[]> {
    return this.http.get<CheckpointRequest[]>(environment.apiHost + 'administration/checkpointequests');
  }

  acceptCheckpointRequest(requestId: number, comment: string): Observable<CheckpointRequest> {
    return this.http.post<CheckpointRequest>(environment.apiHost + 'administration/publicCheckpoint/create/' + requestId + '/' + comment, null);
  }

  rejectCheckpointRequest(requestId: number, comment: string): Observable<CheckpointRequest> {
    return this.http.put<CheckpointRequest>(environment.apiHost + 'administration/checkpointequests/reject/' + requestId + '/' + comment, null);
  }

  //object requests
  getAllObjectRequests(): Observable<ObjectRequest[]> {
    return this.http.get<ObjectRequest[]>(environment.apiHost + 'administration/objectRequests');
  }

  acceptObjectRequest(requestId: number, comment: string): Observable<ObjectRequest> {
    return this.http.post<ObjectRequest>(environment.apiHost + 'administration/publicMapObject/create/' + requestId + '/' + comment, null);
  }

  rejectObjectRequest(requestId: number, comment: string): Observable<CheckpointRequest> {
    return this.http.put<CheckpointRequest>(environment.apiHost + 'administration/objectRequests/reject/' + requestId + '/' + comment, null);
  }

  // notifications
  getNotification(id: number, role: string): Observable<Notification>{
    return this.http.get<Notification>(environment.apiHost + role + `/notifications/${id}`);
  }
  deleteNotification(id: number, role:string): Observable<Notification> {
    return this.http.delete<Notification>(environment.apiHost + role + `/notifications/${id}`);
  }
  updateNotification(role:string, notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(environment.apiHost + role + `/notifications/` + notification.id, notification);
  }
  getAllNotificationsByUser(userId: number, role: string): Observable<PagedResults<Notification>>{
    return this.http.get<PagedResults<Notification>>(environment.apiHost + role + `/notifications/get-all/${userId}`);
  }
  getUnreadNotificationsByUser(userId: number, role: string): Observable<PagedResults<Notification>>{
    return this.http.get<PagedResults<Notification>>(environment.apiHost + role + `/notifications/get-unread/${userId}`);
  }

  //TODO
  //request notifications
  getAllUnreadRequestNotifications(userId: number): Observable<RequestNotification[]> {
    return this.http.get<RequestNotification[]>(environment.apiHost + 'administration/notification/getAllUnread/' + userId);
  }
  markAsReadRequestNotification(notificationId: number): Observable<RequestNotification> {
    return this.http.put<RequestNotification>(environment.apiHost + 'administration/notification/markAsRead/' + notificationId, null);
  }
}
