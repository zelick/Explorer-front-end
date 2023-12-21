import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdministrationService } from '../administration.service';
import { Club } from '../model/club.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-club-form',
  templateUrl: './club-form.component.html',
  styleUrls: ['./club-form.component.css']
})
export class ClubFormComponent implements OnChanges {

  @Output() clubUpdated = new EventEmitter<null>();
  @Input() club: Club;
  @Input() shouldEdit: boolean = false;

  clubs: Club[] = [];
  imagePreview: string[] = [];

  constructor(private authService: AuthService, private service: AdministrationService, private imageService: ImageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.clubForm.reset();
    if (this.shouldEdit) {
      this.clubForm.patchValue({
        name: this.club.name,
        description: this.club.description,
      });
    } else {
      this.imagePreview = [];
    }
  }

  clubForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('')
  })

  addClub(): void {
    this.service.getClub().subscribe({
      next: (result: PagedResults<Club>) => {
        console.log(result);
        this.clubs = result.results;

        const formData = new FormData();
        const club = this.fillForm();
        this.fillFormData(formData, club);
        this.fillImage(formData);

        const formDataObject: { [key: string]: string } = {};
        formData.forEach((value, key) => {
          formDataObject[key] = value.toString();
        });
        console.log('FormData Object:', formDataObject);

        
        this.service.addClub(formData).subscribe({
          next: () => {
            console.log("Uspešno dodat klub");
            this.clubForm.reset();
            this.imagePreview = [];
            this.clubUpdated.emit();
          }
        });
      }
    });
  }

  updateClub(): void {
    const formData = new FormData();
    const club = this.fillForm();
    this.fillFormData(formData, club);
    this.fillImage(formData);
    club.id = this.club.id;
    this.service.updateClub(club.id!, formData).subscribe({
      next: () => {
        this.clubForm.reset();
        this.imagePreview = [];
        this.clubUpdated.emit();
      }
    })
  }

  private fillForm() {
    const club: Club = {
      name: this.clubForm.value.name || "",
      description: this.clubForm.value.description || "",
      touristId: findLoggedUser(this.authService),
      users: []
    };
    return club;
  }

  private fillFormData(formData: FormData, club: Club) {
    formData.append('name', club.name);
    formData.append('description', club.description);
    formData.append('touristId', club.touristId.toString());
    formData.append('users', JSON.stringify(club.users));

  }

  private fillImage(formData: FormData) {
    if (this.clubForm.value.image) {
      const selectedFiles = this.clubForm.value.image;
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('image', selectedFiles[i]);
      }
    }
  }

  onImageSelected(event: any): void {
    const selectedFiles = event?.target?.files;

    if (selectedFiles && selectedFiles.length > 0) {
      this.imagePreview = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imagePreview.push(e.target?.result as string);
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
    }
    this.clubForm.get('image')?.setValue(selectedFiles);
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}

function findLoggedUser(authService: AuthService): number {
  let userId: number | null = null;

  const subscription = authService.user$.subscribe(user => {
    if (user) {
      userId = user.id;
    }
  });

  subscription.unsubscribe();

  return userId ?? 999;
}