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
    profilePicture: new FormControl(null, [Validators.required, this.fileValidator]),
    profilePictureUrl: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  });

  private fileValidator(control: FormControl): { [key: string]: any } | null {
    const value: File | null = control.value;
  
    if (!value) {
      return { required: true, invalidFileType: false };
    }
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (allowedFileTypes.indexOf(value.type) === -1) {
      return { required: false, invalidFileType: true };
    }
  
    return null;
  }
  

  register(): void {
    const profilePictureValue = this.registrationForm.value.profilePicture;
  
    if (this.isFile(profilePictureValue)) {
      const registration: Registration = {
        name: this.registrationForm.value.name || '',
        surname: this.registrationForm.value.surname || '',
        email: this.registrationForm.value.email || '',
        username: this.registrationForm.value.username || '',
        password: this.registrationForm.value.password || '',
        role: this.registrationForm.value.role || 'Author',
        profilePicture: profilePictureValue as File,
        profilePictureUrl: this.registrationForm.value.profilePictureUrl || '',
        biography: this.registrationForm.value.biography || '',
        motto: this.registrationForm.value.motto || '',
      };
  
      const formData = new FormData();
  
      Object.keys(registration).forEach(key => {
        const value = registration[key as keyof Registration];
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
  
      if (this.registrationForm.valid) {
        this.authService.register(formData).subscribe({
          next: () => {
            this.router.navigate(['home']);
          },
        });
      }
      else{
        console.error(this.registrationForm.errors);
      }
    } else {
      console.error('Profile picture is null or undefined.');
    }
  }
  
  private isFile(value: any): value is File {
    return value instanceof File;
  }
  
  selectedImage: string | null = null;

  onProfilePictureSelected(event: any) {
    const file = event?.target?.files[0];

    if (file) {
      this.registrationForm.patchValue({ profilePicture: file });

      const fileName = file.name;
      const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
      const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
      const profilePictureUrl = `${baseName}_profile.${extension}`;
      this.registrationForm.patchValue({ profilePictureUrl });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
    }
  }
}
