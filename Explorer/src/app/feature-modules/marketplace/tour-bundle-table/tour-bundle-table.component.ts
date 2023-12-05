import { Component, OnInit } from '@angular/core';
import { TourBundle } from '../model/tour-bundle.model';
import { MarketplaceService } from '../marketplace.service';
import { PageEvent } from '@angular/material/paginator';
import { ItemType, OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-tour-bundle-table',
  templateUrl: './tour-bundle-table.component.html',
  styleUrls: ['./tour-bundle-table.component.css']
})
export class TourBundleTableComponent implements OnInit {

  tourBundles: TourBundle[] = [];
  pageSize = 5;
  pageIndex = 1;
  totalTourBundles = 0;
  userCart: ShoppingCart;
  isInCart: boolean = false;
  cartItemCount: number;
  tourBundle: TourBundle;
  tourBundleId: number | undefined = undefined;
  user: User;

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTourBundles();
    this.service.cartItemCount$.subscribe(count => this.cartItemCount = count);

    this.authService.user$.subscribe(user => {
      this.user = user;
      this.findShoppingCart();
    });
  }

  loadTourBundles(): void {
    this.service.getTourBundles(this.pageIndex, this.pageSize).subscribe((result) => {
      this.handleTourBundleLoad(result);
    });
  }

  private handleTourBundleLoad(result: any): void {
    this.tourBundles = result.results;
    this.totalTourBundles = result.totalCount;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.loadTourBundles();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 1;
    this.loadTourBundles();
  }

  onAddToCart(tourBundle: TourBundle): void {
    const isConfirmed = window.confirm('Are you sure you want to add this item to the cart?');
    if (isConfirmed) {
      this.tourBundleId = tourBundle.id;
      const orderItem: OrderItem = {
        itemId: tourBundle.id || 0,
        name: tourBundle.name,
        price: tourBundle.price,
        type: ItemType.Bundle
      };
      this.addItemToCart(orderItem);
    }
  }

  addItemToCart(orderItem: OrderItem): void {
    this.service.addItemToShoppingCart(orderItem).subscribe((cart) => {
      this.cartItemCount = cart.items.length;
      this.service.updateCartItemCount(cart.items.length);
      this.userCart = cart;
      this.isInCart = this.isBundleInCart(this.tourBundleId || 0);
    });
  }

  findShoppingCart(): void {
    this.service.getShoppingCart(this.user.id).subscribe((result) => {
      if (!result) {
        this.isInCart = false;
      } else {
        this.userCart = result;
        this.isInCart = this.isBundleInCart(this.tourBundleId || 0);
      }
    });
  }

  isBundleInCart(tourBundleId: number): boolean {
    if (this.userCart.items.length > 0) {
      return this.userCart.items.some(item => item.itemId === tourBundleId);
    }
    return false;
  }
}