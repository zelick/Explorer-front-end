import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationGradeComponent } from './application-grade-form/application-grade.component';
import { GradeReviewComponent } from './application-grade-review/grade-review/grade-review.component';
import { ClubMembershipRequestComponent } from './club-membership-request/club-membership-request.component';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { AccountsManagementComponent } from './accounts/accounts-management/accounts-management.component';
import { ReportedIssuesComponent } from './reported-issues/reported-issues.component';
import { ClubMembersComponent } from './club-members/club-members.component';
import { ClubInvitationsComponent } from './club-invitations/club-invitations.component';
import { CheckpointRequestReviewComponent } from './checkpoint-request-review/checkpoint-request-review/checkpoint-request-review.component';
import { ObjectRequestReviewComponent } from './object-request-review/object-request-review/object-request-review.component';
import { RequestNotificationReviewComponent } from './request-notification-review/request-notification-review/request-notification-review.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ApplicationGradeComponent,
    CheckpointRequestReviewComponent,
    GradeReviewComponent,
    ClubMembershipRequestComponent,
    ClubComponent,
    ClubFormComponent,
    AccountsManagementComponent,
    ReportedIssuesComponent,
    ClubMembersComponent,
    ClubInvitationsComponent,
    CheckpointRequestReviewComponent,
    ObjectRequestReviewComponent,
    RequestNotificationReviewComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ApplicationGradeComponent,
    CheckpointRequestReviewComponent,
    ObjectRequestReviewComponent,
    RequestNotificationReviewComponent,
    GradeReviewComponent,
    ClubMembershipRequestComponent,
    ClubComponent,
    AccountsManagementComponent,
    ReportedIssuesComponent
  ]
})
export class AdministrationModule { }