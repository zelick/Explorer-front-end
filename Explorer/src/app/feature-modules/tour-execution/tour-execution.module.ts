import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { TourExecutionComponent } from './tour-execution/tour-execution.component';

@NgModule({
  declarations: [
    TourExecutionComponent
  ],
  imports: [
    CommonModule,
    MarketplaceModule
  ]
})
export class TourExecutionModule { }
