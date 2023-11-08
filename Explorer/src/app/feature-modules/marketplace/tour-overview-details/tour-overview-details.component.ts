import { Component,OnInit ,ViewChild} from '@angular/core';
import { TourPreview } from '../model/tour-preview';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Router } from '@angular/router';
import { CheckpointPreview } from '../model/checkpoint-preview';
import { OrderItem } from '../model/order-item.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { Customer } from '../model/customer.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(private service: MarketplaceService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
          this.user = user;
      
      this.activatedRoute.params.subscribe(params=>{
              this.tourID=params['id'];
              this.getPublishedTour(this.tourID);
              this.FindShoppingCart();
      })
    });
  }
    tour:TourPreview;
    tourID:number;
    checkpoints:CheckpointPreview;
    profiles: string[] = ['walking', 'cycling', 'driving'];
    profile: string = this.profiles[0];
    user: User;
    userCart: ShoppingCart;
    isTourInCart: boolean = false;
    buttonColor: string = 'orange';

    route(): void{
      let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints.latitude, lon: this.checkpoints.longitude}];

            coords.push({lat:this.checkpoints.latitude, lon:this.checkpoints.longitude});

      this.mapComponent.setRoute(coords, this.profile);
    }
  
    ngAfterViewInit(): void {
      if(this.checkpoints != null)
      {
         let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints.latitude, lon: this.checkpoints.longitude}];

             coords.push({lat:this.checkpoints.latitude, lon:this.checkpoints.longitude});

         this.mapComponent.setRoute(coords, 'walking');
    }
  }
    getPublishedTour(id: number): void {
      this.service.getPublishedTour(id).subscribe((result: TourPreview) => {
        this.tour = result;
        console.log(this.tour);
        this.checkpoints=this.tour.checkpoint;
        if(this.checkpoints != null)
        { 
          this.route();
        } 
    
      });
    }

    onBack():void{
      this.router.navigate([`tour-overview`]);

    }

    onAddToCart(t: TourPreview): void{
      const orderItem: OrderItem = {
        tourId: t.id || 0,
        tourName: t.name,
        price: t.price,
        // quantity: 1 // podesiti 
      };
      this.addItemToCart(orderItem, t);
    }

    addItemToCart(orderItem: OrderItem, tour: TourPreview): void {
      this.service.checkShoppingCart(this.user.id).subscribe((cartExists) => {
        if (cartExists) {
          this.service.getShoppingCart(this.user.id).subscribe((tourShoppingCart) => {
            tourShoppingCart.items.push(orderItem);
            //this.cartItemCount = tourShoppingCart.items.length;
            tourShoppingCart.price = tourShoppingCart.price + orderItem.price;
            this.service.updateShoppingCart(tourShoppingCart).subscribe((result) => {
              //this.cartItemCount = tourShoppingCart.items.length;
              this.userCart = result;
              this.isTourInCart = this.checkIsTourInCart();
              if(this.isTourInCart == true){
                this.buttonColor = 'gray';
              }
            });
          });
        } else {
          const newShoppingCart: ShoppingCart = {
            touristId: this.user.id,
            price: orderItem.price,
            items: [orderItem],
          };
          this.service.addShoppingCart(newShoppingCart).subscribe((createdShoppingCart) => {
  
            this.userCart = createdShoppingCart;
            this.isTourInCart = this.checkIsTourInCart();
            if(this.isTourInCart == true){
              this.buttonColor = 'gray';
            }
            const newCustomer: Customer = {
              touristId: this.user.id,
              purchaseTokens: [],
              shoppingCartId: createdShoppingCart.id || 0
            };
            this.service.createCustomer(newCustomer).subscribe(() => {
  
            });
  
            //this.cartItemCount = 1; // Ažuriranje brojača nakon dodavanja prvog predmeta u praznu korpu
            this.service.updateCartItemCount(1); //
          });
        }
      });
    }

    checkIsTourInCart(): boolean{
      if (this.userCart.items.length > 0) {
        return this.userCart.items.some(item => item.tourId == this.tourID);
      }
      return false;
    }

    FindShoppingCart(): void{
      this.service.getShoppingCart(this.user.id).subscribe((result) => {
        if(!result){
          this.isTourInCart = false;
          this.buttonColor = 'orange';
        }else{
          this.userCart = result;
          this.isTourInCart = this.checkIsTourInCart();
          if(this.isTourInCart == true){
            this.buttonColor = 'gray';
          }
        }
      });
    }
}