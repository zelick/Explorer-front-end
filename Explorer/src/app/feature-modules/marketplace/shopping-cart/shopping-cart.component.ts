import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { Injectable } from '@angular/core';
import { TouristWallet } from '../model/tourist-wallet.model';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  cart: ShoppingCart;
  user: User;
  orderItems: OrderItem[] = [];
  cartItemCount : number;
  adventureCoins: number;

  constructor(private service: MarketplaceService,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getShoppingCart(this.user.id).subscribe({
        next: (result: ShoppingCart) => {
          this.cart = result;
          this.orderItems = this.cart.items;
          this.getAdventureCoins()
          if (this.orderItems.length > 0) {
            this.service.getPublishedTours().subscribe(tourPreviews => {
              this.orderItems.forEach(item => {
                const matchingTour = tourPreviews.find(tour => tour.id === item.itemId);
                item.tourName = matchingTour ? matchingTour.name : 'Tour Name Not Available';
              });
            });
          }
        },
      });
    });
  }

  getAdventureCoins() : void {
    this.service.getAdventureCoins(this.user.id).subscribe({
      next: (result: TouristWallet) => {
        this.adventureCoins = result.adventureCoins
      },
    });
  }

  checkout() {    
    if (this.user && this.user.id !== undefined) {
      this.service.shoppingCartCheckOut(this.user.id).subscribe(
        (cart) => {
          console.log('Uspešno završena kupovina');
          this.cart = cart;
          this.orderItems = this.cart.items;
          this.cart.price = 0;
          this.service.updateCartItemCount(0); 
        },
        (error) => {
          console.error('Greška prilikom završavanja kupovine:', error);
        }
      );
    } else {
      console.error('Nemoguće pristupiti user.id - nije definisano ili ima vrednost undefined.');
    }
  }

  removeShopppingCartItem(tourId: number): void{
    this.orderItems = this.orderItems.filter(item => item.itemId !== tourId);
    this.cart.items = this.orderItems
    this.service.updateShoppingCart(this.cart).subscribe((cart) => {
      this.cart = cart;
      this.cart.price = cart.price;
      this.service.updateCartItemCount(this.cart.items.length); 
    });
  };

/*  increaseQuantity(item: OrderItem): void {
    item.quantity++; 
    this.cart.price = this.calculateTotalPrice();
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--; 
      this.cart.price = this.calculateTotalPrice();
      //this.service.updateShoppingCart(this.cart).subscribe(() => {});           //treba mi ?
    }
  }*/
}