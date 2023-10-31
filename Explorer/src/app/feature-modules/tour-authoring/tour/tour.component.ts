import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{
  tours: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  user: User;
  id:number;
  
  constructor(private service: TourAuthoringService,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getTour();
  }
  
  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTour();
      },
    })
  }

  getTour(): void {
    this.service.getTour(this.user.id).subscribe({
      next: (result: Tour[]) => {
        this.tours = result;
      },
      error: () => {
      }
    })
  }

  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
  }
  openDetails(t:Tour): void {
    this.router.navigate([`tour-details/${t.id}`]);
  }


  addToCart(t: Tour): void{
    const orderItem: OrderItem = {
      tourId: t.id || 0,
      tourName: t.name,
      price: t.price,
    };

    this.service.addOrderItem(orderItem).subscribe({
      next: (result: OrderItem) => {
        this.addItemToCart(orderItem, t);
      },
      error: () => {
      }
    })
  }

  addItemToCart(orderItem: OrderItem, tour: Tour): void{
    this.service.checkShoppingCart(this.user.id).subscribe((cartExists) => {
      if (cartExists) {
        this.service.getShoppingCart(tour.authorId).subscribe((shoppingCart) => {
          shoppingCart.items.push(orderItem);
          this.service.updateShoppingCart(shoppingCart).subscribe(() => {
          });
        });
      } else {
        const newShoppingCart: ShoppingCart = {
          touristId: this.user.id,
          price: orderItem.price,
          items: [orderItem],
        };
        this.service.addShoppingCart(newShoppingCart).subscribe(() => {
        });
      }
    });
  }

}
