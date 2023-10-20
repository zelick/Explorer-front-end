import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourFormComponent } from './tour-form/tour-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TourComponent } from './tour/tour.component';


@NgModule({
  declarations: [
    
  
    TourFormComponent,
              TourComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
    
  ],
  exports:[
    TourFormComponent
  ]
})
export class TourAuthoringModule { }
