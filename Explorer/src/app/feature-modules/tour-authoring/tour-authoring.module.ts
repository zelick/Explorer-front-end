import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckpointFormComponent } from './checkpoint-form/checkpoint-form.component';
import { CheckpointComponent } from './checkpoint/checkpoint.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourComponent } from './tour/tour.component';
import { TourDetailsComponent } from './tour-details/tour-details.component';
import { MapObjectComponent } from './map-object/map-object.component';
import { MapObjectFormComponent } from './map-object-form/map-object-form.component';


@NgModule({
  declarations: [
    CheckpointComponent,
    CheckpointFormComponent,
    TourFormComponent,
    TourComponent,
    TourDetailsComponent,
    MapObjectComponent,
    MapObjectFormComponent
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
    CheckpointFormComponent,
    RouterModule,
    TourFormComponent
  ]
})
export class TourAuthoringModule { }
