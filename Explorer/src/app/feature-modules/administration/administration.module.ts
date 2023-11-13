import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ApplicationGradeComponent,
    GradeReviewComponent,
    ClubMembershipRequestComponent,
    ClubComponent,
    ClubFormComponent,
    AccountsManagementComponent,
    ReportedIssuesComponent,
    ClubMembersComponent,
    ClubInvitationsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ApplicationGradeComponent,
    ClubMembershipRequestComponent,
    ClubComponent,
    AccountsManagementComponent,
    ReportedIssuesComponent,
  ]
})
export class AdministrationModule { }