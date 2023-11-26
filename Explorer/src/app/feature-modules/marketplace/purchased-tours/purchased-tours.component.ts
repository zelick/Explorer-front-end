import { Component, NgIterable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from '@angular/router';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css'],
})

export class PurchasedToursComponent implements OnInit {
  user: User;
  purchasedTours: PurchasedTourPreview[] = [];

  constructor(private service: MarketplaceService, private tourService: TourAuthoringService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.service.getCustomersPurchasedTours(this.user.id).subscribe({
      next: (result) => {
        this.purchasedTours = result;
      },
      error: () => {
      }
    });

  }

  openDetails(tour: PurchasedTourPreview):void{
    this.router.navigate([`purchased-tours-details/${tour.id}`]);
  }

}