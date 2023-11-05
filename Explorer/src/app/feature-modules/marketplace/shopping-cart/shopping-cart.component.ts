import { Component, OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  cart: ShoppingCart;
  user: User;
  orderItems: OrderItem[] = [];

  constructor(private service: MarketplaceService,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getShoppingCart(this.user.id).subscribe({
        next: (result: ShoppingCart) => {
          this.cart = result;
          this.orderItems = this.cart.items;
          console.log(this.cart);
          console.log(this.cart.items);
      },
      })
    });
  }

  removeShopppingCartItem(tourId: number): void{
    this.orderItems = this.orderItems.filter(item => item.tourId !== tourId);
    this.cart.items = this.orderItems
    this.cart.price = this.calculateTotalPrice();
    this.service.updateShoppingCart(this.cart).subscribe(() => {});
  };

  calculateTotalPrice(): number {
    let totalPrice = 0;
    for (const item of this.cart.items) {
      totalPrice += item.price * item.quantity;
    }
    return totalPrice;
  }

  increaseQuantity(item: OrderItem): void {
    item.quantity++; 
    this.cart.price = this.calculateTotalPrice();
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--; 
      this.cart.price = this.calculateTotalPrice();
      //this.service.updateShoppingCart(this.cart).subscribe(() => {});           //treba mi ?
    }
  }
}