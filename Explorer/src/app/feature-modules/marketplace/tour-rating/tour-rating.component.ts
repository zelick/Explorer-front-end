import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { TourRating } from '../model/tour-rating.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
//import { User } from './infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-rating',
  templateUrl: './tour-rating.component.html',
  styleUrls: ['./tour-rating.component.css']
})
export class TourRatingComponent  implements OnInit {
  ratings: TourRating[] = [];
  selectedRating: TourRating;
  shouldRenderTourRatingForm: boolean = false;
  shouldEdit: boolean = false;
  shouldDelete: boolean = false;
  shouldAdd: boolean = false;
  userType: string
  
  constructor(private service: MarketplaceService)  { }

  ngOnInit(): void {
    //TODO -> get userType of the user that is logged on
    this.userType='0'; 
    this.showElements(this.userType);
    this.getTourRating();
  }

  showElements(userType: string): void{
    switch (userType) {
      case '0': { // admin
        this.shouldDelete = true;
        this.shouldAdd = false;
        break;
      }
      case '1': { // author
        this.shouldDelete = false;
        this.shouldAdd = false;
        break;
      }
      default:{ // tourist
        this.shouldDelete = false;
        this.shouldAdd = true;
        break;
      }
    }
  }

  deleteTourRating(id: number): void {
    this.service.deleteTourRating(id).subscribe({
      next: () => {
        this.getTourRating();
      },
    })
  }

  getTourRating(): void {
    this.service.getTourRating(this.userType).subscribe({
      next: (result: PagedResults<TourRating>) => {
        this.ratings = result.results;
        },
        error: () => {
        }
      })
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourRatingForm = true;
  }
}
