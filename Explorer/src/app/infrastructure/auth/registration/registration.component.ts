import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Registration } from '../model/registration.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('Author', [Validators.required]),
    profilePictureUrl: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  });

  register(): void {
    const registration: Registration = {
      name: this.registrationForm.value.name || "",
      surname: this.registrationForm.value.surname || "",
      email: this.registrationForm.value.email || "",
      username: this.registrationForm.value.username || "",
      password: this.registrationForm.value.password || "",
      role: this.registrationForm.value.role || "Author",
      profilePictureUrl: this.registrationForm.value.profilePictureUrl || "",
      biography: this.registrationForm.value.biography || "",
      motto: this.registrationForm.value.motto || ""
    };

    if (this.registrationForm.valid) {
      this.authService.register(registration).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
    }
  }

  onProfilePictureSelected(event: any) {
    const file = event?.target?.files[0]; 
  
    if (this.registrationForm) {
      const controlUrl = this.registrationForm.get('profilePictureUrl');
  
      if (controlUrl) {
        if (file) {
          controlUrl.setValue(file.name);
        }
      }
    }
  }
}
