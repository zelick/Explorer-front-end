import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncounterFormComponent } from './encounter-form/encounter-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    EncounterFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    SharedModule,
    MatSelectModule
  ]
})
export class EncountersModule { }
