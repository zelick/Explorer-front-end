import { Component, OnInit, ViewChild } from '@angular/core';
import { TourPreview } from '../model/tour-preview';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Router } from '@angular/router';
import { CheckpointPreview } from '../model/checkpoint-preview';
import { ItemType, OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { TourRating } from '../model/tour-rating.model';
import { Sale } from '../model/sale.model';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';

@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent;

  tour: TourPreview;
  tourID: number;
  checkpoints: CheckpointPreview;
  profiles: string[] = ['walking', 'cycling', 'driving'];
  profile: string = this.profiles[0];
  user: User;
  tourAvarageRating: number = 0;
  shouldEdit: boolean = false;
  selectedRating: TourRating;
  userCart: ShoppingCart;
  isTourInCart: boolean = false;
  buttonColor: string = 'orange';
  cartItemCount: number;
  location: string;
  tours: TourPreview[] = [];
  isTourOnSale: boolean = false;
  purchasedTours: PurchasedTourPreview[] = [];

  constructor(private service: MarketplaceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.service.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.authService.user$.subscribe(user => {
      this.user = user;

      this.activatedRoute.params.subscribe(params => {
        this.tourID = params['id'];
        this.getPublishedTour(this.tourID);
        this.findShoppingCart();
      });

      this.service.getTouristsPurchasedTours(this.user.id).subscribe((purchasedTours) => {
        this.isTourInCart = this.isTourPurchased(purchasedTours);
        this.buttonColor = this.isTourInCart ? 'gray' : 'orange';
      });

      this.service.getAverageRating(this.tourID).subscribe(
        (averageRating: number) => {
          this.tourAvarageRating = averageRating;
          console.log('Prosečna ocena ture:', this.tourAvarageRating);
        },
        (error) => {
          console.error('Greška prilikom dobavljanja prosečne ocene ture:', error);
        }
      );
    });
  }

  route(): void {
    let coords: [{ lat: number, lon: number }] = [{ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude }];
    coords.push({ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude });
    this.mapComponent.setRoute(coords, this.profile);
  }

  ngAfterViewInit(): void {
    if (this.checkpoints != null) {
      let coords: [{ lat: number, lon: number }] = [{ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude }];
      coords.push({ lat: this.checkpoints.latitude, lon: this.checkpoints.longitude });
      this.mapComponent.setRoute(coords, 'walking');
      this.searchByCoord(this.checkpoints.latitude, this.checkpoints.longitude);
    }

    this.tours[0] = this.tour;

    this.service.getActiveSales().subscribe((activeSales: Sale[]) => {
      this.tours = this.mapDiscountedPricesToTours(this.tours, activeSales);
    });
  }

  mapDiscountedPricesToTours(tours: TourPreview[], activeSales: Sale[]): TourPreview[] {
    return tours.map(tour => {
      const matchingSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
      const discountedPrice = this.calculateDiscountedPrice(tour, activeSales);
      const isOnSale = this.isOnSale(tour.id!, activeSales);

      this.tour.salePrice = discountedPrice;
      this.isTourOnSale = isOnSale;
      return { 
        ...tour,
        discount: matchingSale ? matchingSale.discount : 0,
        salePrice: discountedPrice,
        isOnSale: isOnSale
      };
    });
  }

  calculateDiscountedPrice(tour: TourPreview, activeSales: Sale[]): number {
    const activeSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
    if (activeSale) {
      const discountPercentage = activeSale.discount;
      const discountedPrice = tour.price * (1 - discountPercentage / 100);
      return discountedPrice;
    } else {
      return tour.price;
    }
  }

  isOnSale(tourId: number, activeSales: Sale[]): boolean {
    return activeSales.some(sale => sale.toursIds.includes(tourId));
  }

  searchByCoord(lat: number, lon: number) {
    this.mapComponent.reverseSearch(lat, lon).subscribe({
      next: (location) => {
        const foundLocation = location;
        console.log('Found Location Name:', foundLocation.display_name);
        this.location = foundLocation.address.city + ", " + foundLocation.address.country;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  isTourPurchased(purchasedTours: PurchasedTourPreview[]): boolean {
    return purchasedTours.some(tour => tour.id.toString() === this.tourID.toString());
  }

  getPublishedTour(id: number): void {
    this.service.getPublishedTour(id).subscribe((result: TourPreview) => {
      this.tour = result;
      this.checkpoints = this.tour.checkpoint;
      if (this.checkpoints != null) {
        this.route();
      }
    });
  }

  onBack(): void {
    this.router.navigate([`tour-overview`]);
  }

  onAddToCart(t: TourPreview): void {
    const isConfirmed = window.confirm('Are you sure you want to add this item to the cart?');
    if (isConfirmed) {
      const orderItem: OrderItem = {
        itemId: t.id || 0,
        name: t.name,
        price: t.price,
        type: ItemType.Tour
      };
      this.addItemToCart(orderItem);
    }
  }

  addItemToCart(orderItem: OrderItem): void {
    this.service.addItemToShoppingCart(orderItem).subscribe((cart) => {
      this.cartItemCount = cart.items.length;
      this.service.updateCartItemCount(cart.items.length);
      this.userCart = cart;
      this.isTourInCart = this.checkIsTourInCart();
      if (this.isTourInCart == true) {
        this.buttonColor = 'gray';
      }
    });
  }

  rateTour(tour: TourPreview): void {
    this.router.navigate(['/tour-rating-form', tour.id]);
  }

  isTouristRating(rating: TourRating): boolean {
    return rating.touristId === this.user.id;
  }

  editRating(rating: TourRating): void {
    this.router.navigate(['/tour-rating-edit-form', rating.id]);
  }

  checkIsTourInCart(): boolean {
    if (this.userCart.items.length > 0) {
      return this.userCart.items.some(item => item.itemId == this.tourID);
    }
    return false;
  }

  getFormattedTransportation(transportation: string): string {
    switch (transportation.toLowerCase()) {
      case 'cycling':
        return 'Cycling';
      case 'walking':
        return 'Walking';
      case 'driving':
        return 'Driving';
      default:
        return transportation;
    }
  }

  findShoppingCart(): void {
    this.service.getShoppingCart(this.user.id).subscribe((result) => {
      if (!result) {
        this.isTourInCart = false;
        this.buttonColor = 'orange';
      } else {
        this.userCart = result;
        this.isTourInCart = this.checkIsTourInCart();
        if (this.isTourInCart == true) {
          this.buttonColor = 'gray';
        }
      }
    });
  }
}