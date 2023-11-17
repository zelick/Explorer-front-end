import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocialProfileComponent } from './social-profile/social-profile.component';



@NgModule({
  declarations: [
    SocialProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    SocialProfileComponent
  ]
})
export class UserSocialProfileModule { }
