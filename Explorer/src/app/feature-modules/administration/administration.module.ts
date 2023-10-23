import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ApplicationGradeComponent } from './application-grade-form/application-grade.component';
import { GradeReviewComponent } from './application-grade-review/grade-review/grade-review.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    ApplicationGradeComponent,
    GradeReviewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    ApplicationGradeComponent
  ]
})
export class AdministrationModule { }
