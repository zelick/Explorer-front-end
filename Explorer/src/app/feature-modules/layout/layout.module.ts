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

@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    ProfileAdministrationComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatMenuModule
  ],
  exports: [
    NavbarComponent,
    HomeComponent,
    ProfileAdministrationComponent
  ]
})
export class LayoutModule { }
