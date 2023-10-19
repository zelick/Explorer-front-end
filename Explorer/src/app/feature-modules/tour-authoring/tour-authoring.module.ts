import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CheckpointComponent,
    CheckpointFormComponent
  ]
})
export class TourAuthoringModule { }
