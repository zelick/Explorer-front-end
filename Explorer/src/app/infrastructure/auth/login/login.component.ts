import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { Observable } from 'rxjs';
import { User } from '../model/user.model';

@Component({
  selector: 'xp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isVerified: Observable<boolean>
  user:User|undefined;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    isVerified: new FormControl()
  });

  login(): void {
    const login: Login = {
      username: this.loginForm.value.username || "",
      password: this.loginForm.value.password || "",
    };

    if (this.loginForm.valid) {
      this.authService.isUserVerified(this.loginForm.value.username || "").subscribe((isVerified: boolean) => {
        if (isVerified) {
          this.authService.login(login).subscribe({
            next: () => {

              this.authService.user$.subscribe(user => {
                this.user = user;
                console.log("Ulogovani turista je")
                console.log(this.user)
                if(this.user.role==="tourist")
                {
                  this.router.navigate(['current-location']);
                }else{
                  this.router.navigate(['/']);
                }
              })

             
            },
            error: (error)=>{
            console.error('Login failed:', error); // Log the error for debugging
            alert('Incorrect username or password!');
          }
          });
        } else {
          // Korisnik nije verifikovan, obradite ovaj slučaj
        }
      });
    }
    else{
      alert('Please fill in both username and password.');
    }
  }
}
