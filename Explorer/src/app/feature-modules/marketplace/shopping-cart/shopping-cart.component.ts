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
  coupon: string;

  constructor(private service: MarketplaceService,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getShoppingCart(this.user.id).subscribe({
        next: (result: ShoppingCart) => {
          this.cart = result;
          this.orderItems = this.cart.items;
          this.getAdventureCoins()
        },
      });
    });
  }

  getAdventureCoins(): void {
    this.service.getAdventureCoins(this.user.id).subscribe({
      next: (result: TouristWallet) => {
        this.adventureCoins = result.adventureCoins
      },
    });
  }
  
  calculateTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price, 0);
  }

  checkout() {    
    if (this.user && this.user.id !== undefined) {
      this.service.shoppingCartCheckOut(this.user.id, this.coupon).subscribe(
        (cart) => {
          console.log('Uspešno završena kupovina');
          this.cart = cart;
          this.orderItems = this.cart.items;
          this.cart.price = 0;
          this.service.updateCartItemCount(0); 
          this.getAdventureCoins()
        },
        (error) => {
          if (error.status === 402) {
            console.error('Not enough money:', error);
            alert('Not enough ACs. Please add more Adventure Coins to your account.');
          }
          console.error('Greška prilikom završavanja kupovine:', error);
        }
      );
    } else {
      console.error('Nemoguće pristupiti user.id - nije definisano ili ima vrednost undefined.');
    }
  }

  removeShopppingCartItem(item: OrderItem): void{
    this.service.removeItemFromShoppingCart(item).subscribe((cart) => {
      this.cart = cart;
      this.cart.price = cart.price;
      this.orderItems = this.cart.items;
      this.service.updateCartItemCount(this.cart.items.length); 
    });
  };
}