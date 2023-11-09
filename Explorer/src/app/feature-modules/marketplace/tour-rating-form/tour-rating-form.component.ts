import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { TourRating } from '../model/tour-rating.model';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
  newPictures: string[]=[];
  tourId: number;
  
  constructor(private service: MarketplaceService, private authService: AuthService, private route: ActivatedRoute) { 
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.newPictures=[];
     });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tourId = params['id'];
      console.log(this.tourId);

      if (this.tourId != 0) {
        this.shouldEdit = true;
      }

      console.log(this.shouldEdit)
      console.log(this.rating)

      if (this.shouldEdit && this.rating) {
        this.initializeFormValues();
      }
    });
  }

  initializeFormValues(): void {
    this.tourRatingForm.patchValue({
      rating: this.rating.rating || 0,
      comment: this.rating.comment || '',
      tourId: this.rating.tourId || 0,
      tourDate: this.rating.tourDate || new Date()
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tourRatingForm.reset();
    if(this.shouldEdit) {
      this.tourRatingForm.patchValue(this.rating);
    }
  }
  
  tourRatingForm = new FormGroup({
    rating: new FormControl(0, [Validators.required]),
    comment: new FormControl(''),
    tourId: new FormControl(0, [Validators.required]),
    tourDate: new FormControl(new Date())
  });

  picturesForm = new FormGroup({
    picture: new FormControl<string>("", {nonNullable: true})
  });

  editTourRating(): void {
    const tourRating: TourRating = {
      rating: Number(this.tourRatingForm.value.rating) || 1,
      comment: this.tourRatingForm.value.comment || "",
      touristId: this.user.id,
      tourId: this.tourId,
      tourDate: new Date(),
      creationDate: new Date(),
      pictures: this.newPictures
    };
    tourRating.id = this.tourId;
    this.service.updateTourRating(tourRating).subscribe({
      next: () => {
        this.ratingUpdated.emit()
      }
    })

    this.newPictures=[];
    this.picturesForm.reset();
    this.tourRatingForm.reset();
  }

  addTourRating(): void {
    const rating: TourRating = {
      rating: Number(this.tourRatingForm.value.rating) || 1,
      comment: this.tourRatingForm.value.comment || "",
      touristId: this.user.id,
      tourId: this.tourId,
      tourDate: new Date(), // sta je tourDate proveri
      creationDate: new Date(),
      pictures: this.newPictures
    };
    
    console.log(rating)
    
    this.service.addTourRating(rating).subscribe(
    (response) =>
      {
      this.ratingUpdated.emit();
    }, 
    (error) => {
      alert(error.error);
    });
    this.newPictures=[];
    this.picturesForm.reset();
    this.tourRatingForm.reset();
  }

  addPicture():void{   
    if(this.picturesForm.getRawValue().picture!=""){
      if(this.isExistingPicture(this.picturesForm.getRawValue().picture)===false){
      this.newPictures.push(this.picturesForm.getRawValue().picture);
      this.picturesForm.reset();
      }
    }
  }

  isExistingPicture(pic:string):boolean{
    let isExistingPicture=false;
    this.newPictures.forEach(element => {
      if(element.toLowerCase()==pic)
      isExistingPicture=true;
    });
    return isExistingPicture;
  }

  removePicture(pic:string):void{
    this.newPictures.splice(this.newPictures.indexOf(pic),1);
  }
}
