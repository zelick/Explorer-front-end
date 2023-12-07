import { Component, OnInit } from '@angular/core';
import { CreateCoupon } from '../model/create-coupon.model';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Router } from "@angular/router";


@Component({
  selector: 'xp-create-coupon-form',
  templateUrl: './create-coupon-form.component.html',
  styleUrls: ['./create-coupon-form.component.css']
})
export class CreateCouponFormComponent implements OnInit{
  tours : Tour[];
  user : User;
  discountPercentage: number;
  expirationDate: Date;
  isGlobal: boolean = true;
  selectedTourId: number | null;

  constructor(
    private marketPlaceService: MarketplaceService, 
    private tourAuthoringService: TourAuthoringService,
    private authService: AuthService,
    private router: Router,){ }

    ngOnInit(): void {
      this.isGlobal = true;
      this.authService.user$.subscribe(user => {
        this.user = user;
        this.getTours();
      });
    }

    getTours(): void {
      this.tourAuthoringService.getTour().subscribe((result: Tour[]) => {
        this.tours = result;
      });
    }

    onSubmitForm(): void {
      if(this.isGlobal){
        this.selectedTourId = null;
      }
      const coupon: CreateCoupon = {
          discountPercentage: this.discountPercentage,
          expirationDate: this.expirationDate,
          isGlobal: this.isGlobal,
          tourId: this.selectedTourId
        };

        this.marketPlaceService.createCoupon(coupon).subscribe(() => {this.router.navigate([`/view-coupons`]);});
    }

    selectTourId(selectedTourId: number): void {
        this.selectedTourId = selectedTourId;
    }

}
