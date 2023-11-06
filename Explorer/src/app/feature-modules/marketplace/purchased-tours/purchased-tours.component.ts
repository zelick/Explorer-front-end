import { Component, NgIterable, OnInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';

@Component({
  selector: 'xp-purchased-tours',
  templateUrl: './purchased-tours.component.html',
  styleUrls: ['./purchased-tours.component.css'],
})

export class PurchasedToursComponent implements OnInit {
  user: User;
  purchasedTours: Tour[] = [];
  
  buttons = [
    { text: 'Take a tour' },
  ];

  showTooltip: number | null = null;


  constructor(private service: MarketplaceService, private tourService: TourAuthoringService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.service.getCustomersPurchasedTours(this.user.id).subscribe({
      next: (result: Tour[]) => {
        this.purchasedTours = result;
      },
      error: () => {
        // Obrada greške
      }
    });
  }
}