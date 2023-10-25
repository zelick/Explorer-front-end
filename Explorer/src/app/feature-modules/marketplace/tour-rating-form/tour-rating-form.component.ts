import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace.service';
import { TourRating } from '../model/tour-rating.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xp-tour-rating-form',
  templateUrl: './tour-rating-form.component.html',
  styleUrls: ['./tour-rating-form.component.css'],
  providers: [DatePipe]
})
export class TourRatingFormComponent implements OnChanges {

  @Output() ratingUpdated = new EventEmitter<null>();
  @Input() rating: TourRating;
  @Input() shouldEdit: boolean = false;
  user: User;
  newPictures: string[]=[];
  
  constructor(private service: MarketplaceService, private authService: AuthService) { 
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.newPictures=[];
     });
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
    tourId: new FormControl(0, [Validators.required]),
    tourDate: new FormControl(new Date())
  });

  picturesForm = new FormGroup({
    picture: new FormControl<string>("", {nonNullable: true})
  });

  addTourRating(): void {
    const rating: TourRating = {
      rating: Number(this.tourRatingForm.value.rating) || 1,
      comment: this.tourRatingForm.value.comment || "",
      touristId: this.user.id,
      tourId: Number(this.tourRatingForm.value.tourId) || 0,
      tourDate: this.tourRatingForm.value.tourDate || new Date(),
      creationDate: new Date(),
      pictures: this.newPictures
    };
    
    console.log(rating)
    
    this.service.addTourRating(rating).subscribe({
      next: () => { this.ratingUpdated.emit() }
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
