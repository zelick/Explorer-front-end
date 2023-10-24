import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourPreference } from './model/preference.model';
import { TourRating } from './model/tour-rating.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {

  constructor(private http: HttpClient) { }

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
    let url: string;
    // Construct the URL based on the user type
    switch (userType) {
      case 'administrator': 
        //TODO tourRating-> tour-rating
        url = 'administration/tourRating'; 
        break;
      case 'author': 
        //TODO tourRating-> tour-rating
        url = 'author/tourRating';
        break;
      case 'tourist':
        //TODO tourRating-> tour-rating
        //TODO tourist -> tourism
        url = 'tourist/tourRating';
        break;
      default:
        throw new Error('Invalid user type');
    }

    return this.http.get<PagedResults<TourRating>>(environment.apiHost + url);
  }

  deleteTourRating(id: number): Observable<TourRating> {    
    return this.http.delete<TourRating>(environment.apiHost + 'administration/tourRating/' + id);
    //TODO tourRating-> tour-rating
  }

  addTourRating(rating: TourRating): Observable<TourRating> {
    return this.http.post<TourRating>(environment.apiHost + 'tourist/tourRating', rating);
    //TODO tourRating-> tour-rating
  }
}
