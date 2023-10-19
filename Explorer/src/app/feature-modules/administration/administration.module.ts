import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsManagementComponent } from './accounts/accounts-management/accounts-management.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    AccountsManagementComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    AccountsManagementComponent
  ]
})
export class AdministrationModule { }
