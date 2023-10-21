import { Component, OnInit  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileInfo } from '../model/profileInfo.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'xp-profile-administration',
  templateUrl: './profile-administration.component.html',
  styleUrls: ['./profile-administration.component.css']
})
export class ProfileAdministrationComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router
  ) {}

  isEditing = false;

  startEditing() {
    this.isEditing = true;
  }

  saveChanges() {
    if (this.profileInfoForm.valid) {
      this.isEditing = false; 
    }
    this.edit()
  }

  ngOnInit(): void {
    this.layoutService.fetchCurrentUser().subscribe((user) => {
      this.profileInfoForm.patchValue({
        id: user.id,
        userId: user.userId,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profilePictureUrl: user.profilePictureUrl,
        biography: user.biography,
        motto: user.motto,
      });
    });
  }
  
  profileInfoForm = new FormGroup({
    id: new FormControl(-1, [Validators.required]),
    userId: new FormControl(-1, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('^[A-Z][a-z]*$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    profilePictureUrl: new FormControl('', [Validators.required]),
    biography: new FormControl('', [Validators.required]),
    motto: new FormControl('', [Validators.required])
  });

  edit(): void {
    const profileInfo: ProfileInfo = {
      id: this.profileInfoForm.value.id || -1,
      userId: this.profileInfoForm.value.userId || -1,
      name: this.profileInfoForm.value.name || "",
      surname: this.profileInfoForm.value.surname || "",
      email: this.profileInfoForm.value.email || "",
      profilePictureUrl: this.profileInfoForm.value.profilePictureUrl || "",
      biography: this.profileInfoForm.value.biography || "",
      motto: this.profileInfoForm.value.motto || "",
    };

    if (this.profileInfoForm.valid) {
      this.layoutService.saveNewInfo(profileInfo).subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
      });
    }
  }

  onProfilePictureSelected(event: any) {
    const file = event?.target?.files[0]; 
  
    if (this.profileInfoForm) {
      const controlUrl = this.profileInfoForm.get('profilePictureUrl');
  
      if (controlUrl) {
        if (file) {
          controlUrl.setValue(file.name);
        }
      }
    }
  }
}
