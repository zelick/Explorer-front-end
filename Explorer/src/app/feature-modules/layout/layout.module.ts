import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { RouterModule } from '@angular/router';
import { ProfileAdministrationComponent } from './profile-administration/profile-administration.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { TravelersChoiceComponent } from './travelers-choice/travelers-choice.component';
import { FooterComponent } from './footer/footer.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PopularBlogsComponent } from './popular-blogs/popular-blogs.component';

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ProfileAdministrationComponent,
    TravelersChoiceComponent,
    FooterComponent,
    MyProfileComponent,
    PopularBlogsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule, 
    MatButtonModule,
    MatSidenavModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    ProfileAdministrationComponent
  ]
})
export class LayoutModule { }
