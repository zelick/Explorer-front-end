import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/user.model';
import { SecureToken } from '../../model/secure-token.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'xp-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{

  user: User
  secureTokenData: string
  secureToken: SecureToken
  expiredToken: boolean = false
  usedToken: boolean = false

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.secureTokenData = params['secureToken'];
      //console.log(this.secureTokenData)
      this.getUserId();
    });
  }

  arePasswordsMatching(): boolean {
    const password = this.resetPasswordForm.get('password')!.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')!.value;
    return password === confirmPassword;
  }

  getUserId(): void {
    this.authService.getUserIdByTokenData(this.secureTokenData).subscribe({
      next: (result: number) => {
        this.getUser(result)
      },
      error: () => {
          // Handle errors
      }
  });
  }

  getUser(userId: number): void {
    this.authService.getUserById(userId).subscribe({
      next: (result: User) => {
        this.user = result;
        this.getSecureToken()
      },
      error: () => {
          // Handle errors
      }
  });
  }

  getSecureToken(): void {
    this.authService.getSecureToken(this.user.username).subscribe({
      next: (result: SecureToken) => {
        this.secureToken = result;
      },
      error: () => {
          // Handle errors
      }
  });
  }

  resetPassword(): void {
    const newPassword = this.resetPasswordForm.value.password || ""
    const expiryDate = new Date(this.secureToken.expiryTime)
    
    if(expiryDate.getTime() < Date.now()) {
      this.expiredToken = true;
      this.usedToken = false;
    }
    else if(this.secureToken.isAlreadyUsed) {
      this.usedToken = true;
      this.expiredToken = false;
    }
    else {
      if(this.arePasswordsMatching()){
        this.authService.updatePassword(this.user.username, newPassword).subscribe({
          next: (result: User) => {
            this.usedToken = false;
            this.expiredToken = false;  
            this.resetPasswordForm.reset();
            this.router.navigate(["/login"]);
          },
          error: () => {
              
          }
      });
      }
      else{
        console.log('Error: passwords are not the same!');
        alert('Wrong input, please try again!');
        this.resetPasswordForm.get('password')!.setValue('');
        this.resetPasswordForm.get('confirmPassword')!.setValue('');
      }
    }
  }

}
