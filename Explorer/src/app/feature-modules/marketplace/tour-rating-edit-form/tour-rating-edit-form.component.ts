import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { TourRating } from '../model/tour-rating.model';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-rating-edit-form',
  templateUrl: './tour-rating-edit-form.component.html',
  styleUrls: ['./tour-rating-edit-form.component.css']
})
export class TourRatingEditFormComponent implements OnInit {
  ratingId: number;
  rating: TourRating;
  tourRatingForm: FormGroup; // Dodao FormGroup

  @Output() ratingUpdated = new EventEmitter<null>();

  constructor(
    private service: MarketplaceService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder // Dodao FormBuilder
  ) {
    this.tourRatingForm = this.fb.group({
      rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ratingId = +params['id'];
    });

    this.service.getRating(this.ratingId).subscribe((result: TourRating) => {
      this.rating = result;
      this.patchFormValues(); 
    });
  }

  editTourRating(): void {
    if (this.tourRatingForm.valid) {
      const editedRating: TourRating = {
        id: this.rating.id,
        touristId: this.rating.touristId,
        tourDate: this.rating.tourDate,
        tourId: this.rating.tourId,
        creationDate: this.rating.creationDate,
        pictures: this.rating.pictures,
        rating: this.tourRatingForm.value.rating,
        comment: this.tourRatingForm.value.comment
      };
      this.service.updateTourRating(editedRating).subscribe(
        (response) =>
          {
            this.rating = response;
            this.ratingUpdated.emit();
            this.tourRatingForm.patchValue(this.rating);
    
            this.router.navigate(['/tour-overview-details/', this.rating.tourId]);
        }, 
        (error) => {
          alert(error.error);
      });
    }
  }

  private patchFormValues(): void {
    this.tourRatingForm.patchValue({
      rating: this.rating.rating,
      comment: this.rating.comment
    });
  }
}
