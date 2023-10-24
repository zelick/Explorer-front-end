import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
//import { MatRadioModule } from '@angular/material/radio';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { TourRating } from '../model/tour-rating.model';


@Component({
  selector: 'xp-tour-rating-form',
  templateUrl: './tour-rating-form.component.html',
  styleUrls: ['./tour-rating-form.component.css']
})
export class TourRatingFormComponent {

  @Output() ratingUpdated = new EventEmitter<null>();
  @Input() rating: TourRating;
  @Input() shouldEdit: boolean = false;
  user: User;
  //ratings: Number[] = [1, 2, 3, 4, 5];  //for radio buttons
  
  constructor(private service: MarketplaceService, private authService: AuthService) { 
    this.authService.user$.subscribe(user => {
      this.user = user; });
  }

  ngOnChanges(): void {
    this.tourRatingForm.reset();
    if(this.shouldEdit) {
      this.tourRatingForm.patchValue(this.rating);
    }
  }
  
  
  tourRatingForm = new FormGroup({
    rating: new FormControl(0, [Validators.required]),
    comment: new FormControl(''),
    //TODO touristId saved authomaticaly when created
    //touristId: new FormControl(1),
    tourId: new FormControl(0, [Validators.required]),
    //TODO add tourDate
    //tourDate: new FormControl('', [Validators.required]),
    //TODO date
    //creationDate: new FormControl('', [Validators.required]),
    pictures: new FormControl('')
  });

  addTourRating(): void {
    const currentDateTime = new Date();
    console.log(currentDateTime);
    console.log(this.user.id);

    const rating: TourRating = {
      rating: Number(this.tourRatingForm.value.rating) || 1,
      comment: this.tourRatingForm.value.comment || "",
      //TODO touristId saved authomaticaly when created
      touristId: this.user.id,
      tourId: Number(this.tourRatingForm.value.tourId) || 0,
      //TODO add tourDate 
      //tourDate: new Date(),
      //TODO -> date=currentDate
      creationDate: new Date(),
      pictures: this.tourRatingForm.value.pictures || "",
    };
    console.log(rating.id);

    this.service.addTourRating(rating).subscribe({
      next: () => { this.ratingUpdated.emit();}
    });
  }
}
