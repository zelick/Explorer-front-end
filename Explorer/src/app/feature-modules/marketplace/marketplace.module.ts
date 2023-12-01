import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingIssueComponent } from './reporting-issue/reporting-issue.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreferenceComponent } from './preference/preference/preference.component';
import { PreferenceFormComponent } from './preference-form/preference-form/preference-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { TourRatingComponent } from './tour-rating/tour-rating.component';
import { TourRatingFormComponent } from './tour-rating-form/tour-rating-form.component';
import { SimulatorComponent } from './simulator/simulator.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TourAuthoringModule } from "../tour-authoring/tour-authoring.module";
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { TourOverviewComponent } from './tour-overview/tour-overview.component';
import { TourOverviewDetailsComponent } from './tour-overview-details/tour-overview-details.component';
import { PurchasedToursDetailsComponent } from './purchased-tours-details/purchased-tours-details.component';
import { TourRatingEditFormComponent } from './tour-rating-edit-form/tour-rating-edit-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ForecastPopupComponent } from './forecast-popup/forecast-popup.component';
import { CompositeTourFormComponent } from './composite-tour-form/composite-tour-form.component';
import { CompositeToursComponent } from './composite-tours/composite-tours.component';



@NgModule({
    declarations: [
        ReportingIssueComponent,
        PreferenceComponent,
        PreferenceFormComponent,
        TourRatingComponent,
        TourRatingFormComponent,
        SimulatorComponent,
        ReportingIssueComponent,
        ShoppingCartComponent,
        PurchasedToursComponent,
        TourOverviewComponent,
        TourOverviewDetailsComponent,
        PurchasedToursDetailsComponent,
        TourRatingEditFormComponent,
        ForecastPopupComponent,
        CompositeTourFormComponent,
        CompositeToursComponent
    ],
    exports: [
        PreferenceFormComponent,
        TourRatingFormComponent,
        SimulatorComponent,
        PurchasedToursComponent,
        PreferenceFormComponent, 
        PurchasedToursDetailsComponent
    ],
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        TourAuthoringModule,
        MatDialogModule
    ]
  })

export class MarketplaceModule { }