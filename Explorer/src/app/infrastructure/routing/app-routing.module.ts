import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { MyProfileComponent } from 'src/app/feature-modules/layout/my-profile/my-profile.component';

import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { ClubMembershipRequestComponent } from 'src/app/feature-modules/administration/club-membership-request/club-membership-request.component';
import { ProfileAdministrationComponent } from 'src/app/feature-modules/layout/profile-administration/profile-administration.component';
import { AccountsManagementComponent } from 'src/app/feature-modules/administration/accounts/accounts-management/accounts-management.component';
import { ReportedIssuesComponent } from 'src/app/feature-modules/administration/reported-issues/reported-issues.component';
import { ReportingIssueComponent } from 'src/app/feature-modules/marketplace/reporting-issue/reporting-issue.component';
import { CheckpointComponent } from 'src/app/feature-modules/tour-authoring/checkpoint/checkpoint.component';
import { PreferenceComponent } from 'src/app/feature-modules/marketplace/preference/preference/preference.component';
import { PreferenceFormComponent } from 'src/app/feature-modules/marketplace/preference-form/preference-form/preference-form.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { ApplicationGradeComponent } from 'src/app/feature-modules/administration/application-grade-form/application-grade.component';
import { GradeReviewComponent } from 'src/app/feature-modules/administration/application-grade-review/grade-review/grade-review.component';
import { TourDetailsComponent } from 'src/app/feature-modules/tour-authoring/tour-details/tour-details.component';
import { MapObjectComponent } from 'src/app/feature-modules/tour-authoring/map-object/map-object.component';
import { ClubComponent } from 'src/app/feature-modules/administration/club/club.component';
import { ClubMembersComponent } from 'src/app/feature-modules/administration/club-members/club-members.component';
import { ClubInvitationsComponent } from 'src/app/feature-modules/administration/club-invitations/club-invitations.component';
import { TourRatingComponent } from 'src/app/feature-modules/marketplace/tour-rating/tour-rating.component';
import { TourRatingFormComponent } from 'src/app/feature-modules/marketplace/tour-rating-form/tour-rating-form.component';
import { CheckpointRequestReviewComponent } from 'src/app/feature-modules/administration/checkpoint-request-review/checkpoint-request-review/checkpoint-request-review.component';
import { BlogPostTableComponent } from 'src/app/feature-modules/blog/blog-post-table/blog-post-table.component';
import { BlogPostComponent } from 'src/app/feature-modules/blog/blog-post/blog-post.component';
import { BlogPostManagementComponent } from 'src/app/feature-modules/blog/blog-post-management/blog-post-management.component';
import { SimulatorComponent } from 'src/app/feature-modules/marketplace/simulator/simulator.component';
import { SocialProfileComponent } from 'src/app/feature-modules/user-social-profile/social-profile/social-profile.component';
import { ObjectRequestReviewComponent } from 'src/app/feature-modules/administration/object-request-review/object-request-review/object-request-review.component';
import { TourEquipmentComponent } from 'src/app/feature-modules/tour-authoring/tour-equipment/tour-equipment.component';
import { TourOverviewComponent } from 'src/app/feature-modules/marketplace/tour-overview/tour-overview.component';
import { TourOverviewDetailsComponent } from 'src/app/feature-modules/marketplace/tour-overview-details/tour-overview-details.component';
import { ShoppingCartComponent } from 'src/app/feature-modules/marketplace/shopping-cart/shopping-cart.component';
import { PurchasedToursComponent } from 'src/app/feature-modules/marketplace/purchased-tours/purchased-tours.component';
import { PurchasedToursDetailsComponent } from 'src/app/feature-modules/marketplace/purchased-tours-details/purchased-tours-details.component';
import { TourRatingEditFormComponent } from 'src/app/feature-modules/marketplace/tour-rating-edit-form/tour-rating-edit-form.component';
import { CheckpointSecretFormComponent } from 'src/app/feature-modules/tour-authoring/checkpoint-secret-form/checkpoint-secret-form.component';
import { TourExecutionComponent } from 'src/app/feature-modules/tour-execution/tour-execution/tour-execution.component';
import { NotificationsComponent } from 'src/app/feature-modules/administration/notifications/notifications.component';
import { TourBundleTableComponent } from 'src/app/feature-modules/marketplace/tour-bundle-table/tour-bundle-table.component';
import { SaleComponent } from 'src/app/feature-modules/marketplace/sale/sale.component';
import { SaleFormComponent } from 'src/app/feature-modules/marketplace/sale-form/sale-form.component';
import { TourBundlesComponent } from 'src/app/feature-modules/tour-authoring/tour-bundles/tour-bundles.component';
import { TourBundleEditComponent } from 'src/app/feature-modules/tour-authoring/tour-bundle-edit/tour-bundle-edit.component';
import { CreateCouponFormComponent } from 'src/app/feature-modules/marketplace/create-coupon-form/create-coupon-form.component';
import { ViewCouponAuthorComponent } from 'src/app/feature-modules/marketplace/view-coupon-author/view-coupon-author.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'create-coupon', component: CreateCouponFormComponent},
  {path: 'view-coupons', component: ViewCouponAuthorComponent},
  { path: 'my-profile', 
    component: MyProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile-info', pathMatch: 'full'}, 
      // TODO -> administrator should open accounts first
      //ADMIN
      { path: 'accounts', component: AccountsManagementComponent, canActivate: [AuthGuard],},
      { path: 'grade-review', component: GradeReviewComponent, canActivate: [AuthGuard], },
      { path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
      { path: 'object-request-review', component: ObjectRequestReviewComponent, canActivate: [AuthGuard]},
      { path: 'checkpoint-request-review', component: CheckpointRequestReviewComponent, canActivate: [AuthGuard]},

      //TOURIST and AUTHOR
      { path: 'profile-info', component: ProfileAdministrationComponent, canActivate: [AuthGuard],},
      { path: 'my-blogs', component: BlogPostManagementComponent, canActivate: [AuthGuard]},
      //{ path: 'blogs/:id', component: BlogPostComponent, canActivate: [AuthGuard]},

      //TOURIST only
      { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard], },
      { path: 'tour-overview',component:TourOverviewComponent,canActivate:[AuthGuard]},
      { path: 'tour-overview-details/:id',component:TourOverviewDetailsComponent,canActivate:[AuthGuard]},
      { path: 'simulator', component: SimulatorComponent, canActivate:[AuthGuard] },
      { path: 'purchased-tours', component: PurchasedToursComponent, canActivate: [AuthGuard] },
      { path: 'tour-bundles', component: TourBundleTableComponent, canActivate:[AuthGuard] },
      //{ path: 'purchased-tours-details/:id', component: PurchasedToursDetailsComponent, canActivate: [AuthGuard] },
      { path: 'club', component: ClubComponent, canActivate: [AuthGuard] },
      //{ path: 'clubMembershipRequests/:id', component: ClubMembershipRequestComponent, canActivate: [AuthGuard]},
      //{ path: 'invitations', component: ClubInvitationsComponent},
      { path: 'club-members/:id', component: ClubMembersComponent, canActivate: [AuthGuard]},
      { path: 'preference', component: PreferenceComponent, canActivate:[AuthGuard]},
      { path: 'reporting-issues', component: ReportingIssueComponent, canActivate: [AuthGuard],},

      //AUTHOR only
      { path: 'tour', component: TourComponent,canActivate:[AuthGuard] },
      { path: 'checkpoint/:id', component: CheckpointComponent, canActivate: [AuthGuard] },
      { path: 'map-object', component: MapObjectComponent, canActivate: [AuthGuard] },
      {path: 'sales-form/:id', component: SaleFormComponent, canActivate: [AuthGuard],},
      

      //ALL USERS
      { path: 'reported-issues', component: ReportedIssuesComponent, canActivate: [AuthGuard] },
      { path: 'reported-issues/:id', component: ReportedIssuesComponent, canActivate: [AuthGuard],},
      { path: 'tour-rating', component: TourRatingComponent, canActivate: [AuthGuard] },
      { path: 'social-profile', component: SocialProfileComponent, canActivate:[AuthGuard] },
      { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard],},
      {path: 'sales', component: SaleComponent, canActivate: [AuthGuard],}
    ]
  },
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard]},
  {path: 'club', component: ClubComponent},
  {path: 'profile-info', component: ProfileAdministrationComponent},
  {path: 'clubMembershipRequests/:id', component: ClubMembershipRequestComponent},
  {path: 'profile-info', component: ProfileAdministrationComponent},
  {path: 'accounts', component: AccountsManagementComponent, canActivate: [AuthGuard],},
  {path: 'reported-issues', component: ReportedIssuesComponent, canActivate: [AuthGuard],},
  {path: 'reported-issues/:id', component: ReportedIssuesComponent, canActivate: [AuthGuard],},
  {path: 'reporting-issues', component: ReportingIssueComponent, canActivate: [AuthGuard],},
  {path: 'checkpoint/:id', component: CheckpointComponent, canActivate: [AuthGuard]},
  {path: 'map-object', component: MapObjectComponent, canActivate: [AuthGuard]},
  {path: 'tour-form/:id', component: TourFormComponent,canActivate:[AuthGuard]},
  {path: 'tour', component: TourComponent,canActivate:[AuthGuard]},
  {path: 'application-grade', component: ApplicationGradeComponent},
  {path: 'grade-review', component: GradeReviewComponent},
  {path: 'checkpoint-request-review', component: CheckpointRequestReviewComponent},
  {path: 'object-request-review', component: ObjectRequestReviewComponent},
  {path: 'preference-form', component: PreferenceFormComponent, canActivate:[AuthGuard]},
  {path: 'preference', component: PreferenceComponent, canActivate:[AuthGuard]},
  {path: 'tour-details/:id', component: TourDetailsComponent, canActivate: [AuthGuard]},
  {path: 'blogs', component: BlogPostTableComponent, canActivate: [AuthGuard]},
  {path: 'blogs/:id', component: BlogPostComponent, canActivate: [AuthGuard]},
  {path: 'my-blogs', component: BlogPostManagementComponent, canActivate: [AuthGuard]},
  {path: 'club-members/:id', component: ClubMembersComponent},
  {path: 'invitations', component: ClubInvitationsComponent},
  {path: 'tour-rating', component: TourRatingComponent, canActivate: [AuthGuard]},
  {path: 'tour-rating-form/:id', component: TourRatingFormComponent, canActivate: [AuthGuard]},
  {path: 'tour-rating-edit-form/:id', component: TourRatingEditFormComponent, canActivate: [AuthGuard]},
  {path: 'simulator', component: SimulatorComponent, canActivate:[AuthGuard]},
  {path: 'tour-equipment/:id',component:TourEquipmentComponent,canActivate:[AuthGuard]},
  {path: 'tour-overview',component:TourOverviewComponent,canActivate:[AuthGuard]},
  {path: 'tour-overview-details/:id',component:TourOverviewDetailsComponent,canActivate:[AuthGuard]},
  {path: 'tour-rating-form', component: TourRatingFormComponent, canActivate: [AuthGuard]},
  {path: 'simulator', component: SimulatorComponent, canActivate:[AuthGuard]},
  {path: 'social-profile', component: SocialProfileComponent, canActivate:[AuthGuard]},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'purchased-tours', component: PurchasedToursComponent, canActivate: [AuthGuard]},
  {path: 'purchased-tours-details/:id', component: PurchasedToursDetailsComponent, canActivate: [AuthGuard]},
  {path: 'checkpoint-secret/:id',component: CheckpointSecretFormComponent,canActivate:[AuthGuard]},
  {path: 'tour-execution/:tourId', component: TourExecutionComponent, canActivate: [AuthGuard]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard]},
  {path: 'tour-bundles', component: TourBundleTableComponent, canActivate:[AuthGuard]},
  {path: 'sales', component: SaleComponent, canActivate: [AuthGuard],},
  {path: 'sales-form/:id', component: SaleFormComponent, canActivate: [AuthGuard],},
  {path: 'tour-bundles/:id', component: TourBundlesComponent , canActivate: [AuthGuard]},
  {path: 'tour-bundle-edit/:id', component: TourBundleEditComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }