import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourExecutionComponent } from './tour-execution/tour-execution.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PrivateTourExecutionComponent } from './private-tour-execution/private-tour-execution.component';

@NgModule({
  declarations: [
    TourExecutionComponent,
    PrivateTourExecutionComponent, 
    SimulatorComponent
    ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[
    TourExecutionComponent,
    SimulatorComponent
  ]
})
export class TourExecutionModule { }
