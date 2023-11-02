import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ReportedIssue } from './model/reported-issue.model';
import { TourPreference } from './model/preference.model';
import { TourRating } from './model/tour-rating.model';
import { Tour } from '../tour-authoring/model/tour.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
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

  getPublishedTours():Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'tourist/shopping')
  }

  getPublishedTour(id:number): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'tourist/shopping/details/' + id);
  }
}
