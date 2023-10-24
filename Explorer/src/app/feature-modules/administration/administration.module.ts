import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ClubComponent } from './club/club.component';
import { ClubFormComponent } from './club-form/club-form.component';
import { AccountsManagementComponent } from './accounts/accounts-management/accounts-management.component';
import { ReportedIssuesComponent } from './reported-issues/reported-issues.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ClubComponent,
    ClubFormComponent
    AccountsManagementComponent,
    ReportedIssuesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ClubComponent
    AccountsManagementComponent,
    ReportedIssuesComponent
  ]
})
export class AdministrationModule { }