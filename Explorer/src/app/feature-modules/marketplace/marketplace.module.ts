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
import { AllToursComponent } from './all-tours/all-tours.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchasedToursComponent } from './purchased-tours/purchased-tours.component';
import { TourOverviewComponent } from './tour-overview/tour-overview.component';
import { TourOverviewDetailsComponent } from './tour-overview-details/tour-overview-details.component';
import { PurchasedToursDetailsComponent } from './purchased-tours-details/purchased-tours-details.component';
import { TourRatingEditFormComponent } from './tour-rating-edit-form/tour-rating-edit-form.component';


@NgModule({
    declarations: [
        ReportingIssueComponent,
        PreferenceComponent,
        PreferenceFormComponent,
        TourRatingComponent,
        TourRatingFormComponent,
        SimulatorComponent,
        AllToursComponent,
        ShoppingCartComponent,
        PurchasedToursComponent,
        TourOverviewComponent,
        TourOverviewDetailsComponent,
        PurchasedToursDetailsComponent,
        TourRatingEditFormComponent
    ],
    exports: [
        PreferenceFormComponent,
        TourRatingFormComponent,
        SimulatorComponent,
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
        TourAuthoringModule
    ]
})
export class MarketplaceModule { }