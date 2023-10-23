import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { TourFormComponent } from 'src/app/feature-modules/tour-authoring/tour-form/tour-form.component';
import { TourComponent } from 'src/app/feature-modules/tour-authoring/tour/tour.component';
import { ApplicationGradeComponent } from 'src/app/feature-modules/administration/application-grade-form/application-grade.component';
import { GradeReviewComponent } from 'src/app/feature-modules/administration/application-grade-review/grade-review/grade-review.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'equipment', component: EquipmentComponent, canActivate: [AuthGuard],},
  {path: 'tour-form', component: TourFormComponent,canActivate:[AuthGuard]},
  {path: 'tour', component: TourComponent,canActivate:[AuthGuard]},
  {path: 'application-grade', component: ApplicationGradeComponent},
  {path: 'grade-review', component: GradeReviewComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
