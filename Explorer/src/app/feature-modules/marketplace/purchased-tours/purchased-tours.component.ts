import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MarketplaceService } from '../marketplace.service';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';
import { Router } from '@angular/router';
import { TourRatingPreview } from "../../marketplace/model/tour-rating-preview";

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css'],
})

export class PurchasedToursComponent implements OnInit {
  user: User;
  purchasedTours: PurchasedTourPreview[] = [];

  constructor(private service: MarketplaceService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.service.getTouristsPurchasedTours(this.user.id).subscribe({
      next: (result) => {
        this.purchasedTours = result;
      },
      error: () => {
      }
    });
  }

  openDetails(tour: PurchasedTourPreview): void {
    this.router.navigate([`purchased-tours-details/${tour.id}`]);
  }

  getDemandColor(demandLevel: string): string {
    switch (demandLevel.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'black';
    }
  }

  calculateAverageRating(ratings: TourRatingPreview[]): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
  
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return totalRating / ratings.length;
  }
}