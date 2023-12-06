import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ReportedIssue } from '../administration/model/reported-issue.model';
import { TourPreference } from './model/preference.model';
import { TourRating } from './model/tour-rating.model';
import { TouristPosition } from './model/position.model';
import { OrderItem } from './model/order-item.model';
import { ShoppingCart } from './model/shopping-cart.model';
import { Customer } from './model/customer.model';
import { Tour } from '../tour-authoring/model/tour.model';
import { TourPreview } from './model/tour-preview';
import { PublicTour } from './model/public-tour.model';
import { TourExecution } from '../tour-execution/model/tour_execution.model';
import { MapObject } from '../tour-authoring/model/map-object.model';
import { PublicCheckpoint } from '../tour-execution/model/public_checkpoint.model';
import { PurchasedTourPreview } from '../tour-execution/model/purchased_tour_preview.model';
import { TouristWallet } from './model/tourist-wallet.model';
import { NgPlural } from '@angular/common';
import { CompositeForm } from './model/composite-create';
import { CompositePreview } from './model/composite-preview';

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

  addReportedIssue(reportedIssue: string): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + 'tourist/reportingIssue/' + reportedIssue,null);
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

  addTourRating(ratingForm: FormData): Observable<TourRating> {
    return this.http.post<TourRating>(environment.apiHost + 'tourist/tour-rating', ratingForm);
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

  getShoppingCart(touristId: number): Observable<ShoppingCart> {
    const params = new HttpParams().set('touristId', touristId.toString());
    return this.http.get<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/', { params });
  }

  updateShoppingCart(shoppingCart: ShoppingCart): Observable<ShoppingCart> {
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/' + shoppingCart.id, shoppingCart);
  }

  shoppingCartCheckOut(id: number): Observable<ShoppingCart> {
    const params = new HttpParams().set('touristId', id.toString());
    return this.http.put<ShoppingCart>(environment.apiHost + 'shopping/shopping-cart/checkout', null, { params });
  }

  getTours(): Observable<PagedResults<Tour>> {
    return this.http.get<PagedResults<Tour>>(environment.apiHost + 'administration/tour');
  }

  getCustomer(touristId: number): Observable<Customer> {
    const params = new HttpParams().set('touristId', touristId.toString());
    return this.http.get<Customer>(environment.apiHost + 'shopping/customer/', { params });
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(environment.apiHost + 'shopping/customer', customer);
  }

  getCustomersPurchasedTours(id: number): Observable<PurchasedTourPreview[]> {
    const params = new HttpParams().set('touristId', id.toString());
    return this.http.get<PurchasedTourPreview[]>(environment.apiHost + 'shopping/customer/purchased-tours', { params })
  }

  getPublishedTours():Observable<TourPreview[]> {
    return this.http.get<TourPreview[]>(environment.apiHost + 'tourist/shopping')
  }

  getPublishedTour(id:number): Observable<TourPreview> {
    return this.http.get<TourPreview>(environment.apiHost + 'tourist/shopping/details/' + id);
  }

  getPurchasedTourDetails(tourId: number):Observable<PurchasedTourPreview> {
    return this.http.get<PurchasedTourPreview>(environment.apiHost + 'shopping/customer/purchased-tour-details/' + tourId)
  }

  //
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  updateCartItemCount(count: number): void {
    this.cartItemCountSubject.next(count);
  }

  getPublicTours():Observable<PublicTour[]>{
    return this.http.get<PublicTour[]>(environment.apiHost + 'tourist/publicTours/getAll') 
  }
  startExecution(tourId: number, touristId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution/' + touristId, tourId);
  }

  getAverageRating(id:number): Observable<number> {
    return this.http.get<number>(environment.apiHost + 'tourist/shopping/averageRating/' + id)
  }

  getRating(id:number): Observable<TourRating> {
    return this.http.get<TourRating>(environment.apiHost + 'tourist/tour-rating/getTourRating/' + id)
  }

  getMapObjects(): Observable<PagedResults<MapObject>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'map-object', {params: queryParams});
  }

  getPublicCheckpoints(): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint');
  }

  getAdventureCoins(id:number): Observable<TouristWallet> {
    return this.http.get<TouristWallet>(environment.apiHost + 'tourist/wallet/get-adventure-coins/' + id)
  }

  paymentAdventureCoins(id:number, coins: number): Observable<TouristWallet> {
    return this.http.put<TouristWallet>(environment.apiHost + 'tourist/wallet/payment-adventure-coins/' + id + '/' + coins, null)
  }

  addCompositeTour(compositeTour: CompositeForm): Observable<CompositeForm> {
    return this.http.post<CompositeForm>(environment.apiHost + 'tourist/compositeTours', compositeTour);
  }

  getCompositeToursId(tourId:number):Observable<CompositePreview[]> {
    return this.http.get<CompositePreview[]>(environment.apiHost + 'tourist/compositeTours' + tourId) 
  }

  getAllCompositeTours():Observable<CompositePreview[]>{
    return this.http.get<CompositePreview[]>(environment.apiHost + 'tourist/compositeTours') 
  }

}