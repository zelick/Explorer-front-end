import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { TourExecutionComponent } from './tour-execution/tour-execution.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PrivateTourExecutionComponent } from './private-tour-execution/private-tour-execution.component';
import { TourRecommendationsComponent } from './tour-recommendations/tour-recommendations.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TourExecutionComponent,
    PrivateTourExecutionComponent,
    TourRecommendationsComponent
    ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MarketplaceModule
  ],
  exports:[
    TourExecutionComponent
  ]
})
export class TourExecutionModule { }
