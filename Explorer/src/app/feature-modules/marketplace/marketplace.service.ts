import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ReportedIssue } from './model/reported-issue.model';
import { TourPreference } from './model/preference.model';
import { TourRating } from './model/tour-rating.model';
import { TouristPosition } from './model/position.model';
import { OrderItem } from './model/order-item.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { Customer } from './model/customer.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { TourPreview } from './model/tour-preview';
import { TourExecution } from '../tour-execution/model/tour_execution.model';


@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  [x: string]: any;
  getCheckpointsByTour(tourId: number) {
      throw new Error('Method not implemented.');
  }
  getCheckpoints() {
      throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }

  addReportedIssue(reportedIssue: ReportedIssue): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + 'tourist/reportingIssue', reportedIssue);
  }

  addTourPreference(preference: TourPreference): Observable<TourPreference> {
    return this.http.post<TourPreference>(environment.apiHost + 'tourism/preference', preference);
  }

  updateTourPreference(preference: TourPreference): Observable<TourPreference> {
    return this.http.put<TourPreference>(environment.apiHost + 'tourism/preference/' + preference.id, preference);
  }

  getTourPreference(id: number): Observable<TourPreference> {
    return this.http.get<TourPreference>(environment.apiHost + 'tourism/preference/'+id)
  }

  deleteTourPreference(id: number): Observable<TourPreference> {
    return this.http.delete<TourPreference>(environment.apiHost + 'tourism/preference/' + id);
  }

  getTourRating(userType: string): Observable<PagedResults<TourRating>> {
    let url: string;  // Construct the URL based on the user type
    switch (userType) {
      case 'administrator': 
        url = 'administration/tour-rating'; 
        break;
      case 'author': 
        url = 'author/tour-rating';
        break;
      case 'tourist':
        //TODO tourist -> tourism ???
        url = 'tourist/tour-rating';
        break;
      default:
        throw new Error('Invalid user type');
    }

    return this.http.get<PagedResults<TourRating>>(environment.apiHost + url);
  }

  deleteTourRating(id: number): Observable<TourRating> {    
    return this.http.delete<TourRating>(environment.apiHost + 'administration/tour-rating/' + id);
  }

  addTourRating(rating: TourRating): Observable<TourRating> {
    return this.http.post<TourRating>(environment.apiHost + 'tourist/tour-rating', rating);
  }


  updateTourRating(rating: TourRating): Observable<TourRating> {
    return this.http.put<TourRating>(environment.apiHost + 'tourist/tour-rating/' + rating.id, rating);
  }

  addTouristPosition(position: TouristPosition): Observable<TouristPosition> {
    return this.http.post<TouristPosition>(environment.apiHost + 'tourism/position', position);
  }

  updateTouristPosition(position: TouristPosition): Observable<TouristPosition> {
    return this.http.put<TouristPosition>(environment.apiHost + 'tourism/position/' + position.id, position);
  }

  getTouristPosition(id: number): Observable<TouristPosition> {
    return this.http.get<TouristPosition>(environment.apiHost + 'tourism/position/'+id)
  }

  deleteTouristPosition(id: number): Observable<TouristPosition> {
    return this.http.delete<TouristPosition>(environment.apiHost + 'tourism/position/' + id);
  }

  checkShoppingCart(touristId: number): Observable<boolean> {
    return this.http.get<boolean>(environment.apiHost + 'tourist/shopping-cart/checkShoppingCart/' + touristId);
  }

  addOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(environment.apiHost + 'tourist/order-item', orderItem);
  }

  getShoppingCart(touristId: number): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(environment.apiHost + 'tourist/shopping-cart/getShoppingCart/' + touristId);
  }

  addShoppingCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(environment.apiHost + 'tourist/shopping-cart', shoppingCart);
  }

  updateShoppingCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'tourist/shopping-cart/' + shoppingCart.id, shoppingCart);
  }

  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tour');
  }
  getCustomersPurchasedTours(id: number): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'customer/cutomersPurchasedTours/'+ id)
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.apiHost + 'customer/create', customer);
  }

  shoppingCartCheckOut(id: number): Observable<Customer> {
    return this.http.put<Customer>(environment.apiHost + 'customer/' + id, {});
  }

  deleteOrderItems(id: number): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(environment.apiHost + 'tourist/shopping-cart/deleteOrderItems/' + id);
  }

  getPublishedTours():Observable<TourPreview[]> {
    return this.http.get<TourPreview[]>(environment.apiHost + 'tourist/shopping')
  }

  getPublishedTour(id:number): Observable<TourPreview> {
    return this.http.get<TourPreview>(environment.apiHost + 'tourist/shopping/details/' + id);
  }

  getPurchasedTourDetails(id:number):Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'customer/customersPurchasedTourDetails/'+ id)
  }

  //
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  updateCartItemCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }

  //PublicTours 
  getPublicTours():Observable<TourPreview[]> {
    return this.http.get<TourPreview[]>(environment.apiHost + 'tourist/shopping') //zameni
  startExecution(tourId: number, touristId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution/' + touristId, tourId);
  }

  getAverageRating(id:number): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'tourist/shopping/averageRating/' + id)
  }

  getRating(id:number): Observable<TourRating> {
    return this.http.get<TourRating>(environment.apiHost + 'tourist/tour-rating/getTourRating/' + id)
  }
}