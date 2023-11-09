import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams} from '@angular/common/http';
import { TourPreview } from '../marketplace/model/tour-preview';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tour_execution.model';
import { query } from '@angular/animations';
import { TouristPosition } from '../marketplace/model/position.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }
  getTourExecution(touristId: number, tourId: number): Observable<TourExecution> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tourId",tourId);
    queryParams = queryParams.append("touristId",touristId);
    return this.http.get<TourExecution>(environment.apiHost + 'tour-execution', {params: queryParams})
  }

}
