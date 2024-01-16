import { Component, EventEmitter, Inject, Input, Output, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { ImageService } from 'src/app/shared/image/image.service';
import { TourRating } from '../model/tour-rating.model';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-rating-form',
  templateUrl: './tour-rating-form.component.html',
  styleUrls: ['./tour-rating-form.component.css'],
  providers: [DatePipe]
})
export class TourRatingFormComponent implements OnChanges, OnInit {

  @Output() ratingUpdated = new EventEmitter<null>();
  @Input() rating: TourRating;
  @Input() shouldEdit: boolean = false;
  user: User;
  imagePreview: string[] = [];
  tourId: number;

  constructor(private service: MarketplaceService, private authService: AuthService,
    private imageService: ImageService, 
    private route: ActivatedRoute, private router: Router ) { 
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.imagePreview = [];
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tourId = params['id'];
      console.log(this.tourId);
    });
  }

  ngOnChanges(): void {
    this.tourRatingForm.reset();
    if(this.shouldEdit) {
      this.tourRatingForm.patchValue({
        rating: this.rating.rating,
        tourId: this.rating.tourId
      });
      this.imagePreview = this.rating.imageNames?.map(imageName => this.getImageUrl(imageName)) || [];
      } else {
        this.imagePreview = [];
      }  
    }
  
  tourRatingForm = new FormGroup({
    rating: new FormControl(0, [Validators.required]),
    comment: new FormControl(''),
    tourId: new FormControl(0, [Validators.required]),
    tourDate: new FormControl(new Date()),
    images: new FormControl('')
  });

  addTourRating(): void {
    const formData = new FormData();
    const ratingForm = this.fillForm();
    this.fillFormData(formData, ratingForm);
    this.fillImages(formData);
    
    this.service.addTourRating(formData).subscribe({
      next: () => { 
        this.imagePreview = [];
        this.ratingUpdated.emit();
        this.tourRatingForm.reset();
        this.router.navigate(['/tour-overview-details/', this.tourId]);
      },
      error: (err) => {
        console.error('Couldnt add rating: ', err);
        alert('Couldnt add rating: ');
        this.router.navigate(['/tour-overview-details/', this.tourId]);
      }
    });
  }

  private fillForm() {
    const currentDateTime = new Date();
    const rating: TourRating = {
      rating: Number(this.tourRatingForm.value.rating) || 1,
      comment: this.tourRatingForm.value.comment || "",
      touristId: this.user.id,
      tourId: this.tourId,
      tourDate: new Date(), // sta je tourDate proveri
      creationDate: currentDateTime
    };
    return rating;
  }

  private fillFormData(formData: FormData, rating: TourRating) {
    formData.append('rating', rating.rating!.toString());
    formData.append('comment', rating.comment!.toString());
    formData.append('touristId', rating.touristId!.toString());
    formData.append('tourId', rating.tourId!.toString());
    formData.append('tourDate', rating.tourDate.toISOString());
    formData.append('creationDate', rating.creationDate.toISOString());
  }
  
  private fillImages(formData: FormData) {
    if (this.tourRatingForm.value.images) {
      const selectedFiles = this.tourRatingForm.value.images;
      for (let i = 0; i < selectedFiles.length; i++) {
        
        console.log(i);
        formData.append('images', selectedFiles[i]);
      }
    }
  }

  // image upload
  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
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
    this.tourRatingForm.get('images')?.setValue(selectedFiles);
  }

  // TODO -> add removeImage button
  // private removeImage(image :string):void{
  //   this.imagePreview.splice(this.imagePreview.indexOf(image),1);
  // }
}