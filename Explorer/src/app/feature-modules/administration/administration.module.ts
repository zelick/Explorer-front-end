import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportedIssuesComponent } from './reported-issues/reported-issues.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
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
    ReportedIssuesComponent
  ]
})
export class AdministrationModule { }
