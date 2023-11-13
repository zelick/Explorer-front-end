import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialProfileComponent } from './social-profile/social-profile.component';



@NgModule({
  declarations: [
    SocialProfileComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    SocialProfileComponent
  ]
})
export class UserSocialProfileModule { }
