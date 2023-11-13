import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams} from '@angular/common/http';
import { TourPreview } from '../marketplace/model/tour-preview';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourExecution } from './model/tour_execution.model';
import { query } from '@angular/animations';
import { TouristPosition } from '../marketplace/model/position.model';
import { MapObject } from '../tour-authoring/model/map-object.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }
  getTourExecution(touristId: number, tourId: number): Observable<TourExecution> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tourId",tourId);
    queryParams = queryParams.append("touristId",touristId);
    return this.http.get<TourExecution>(environment.apiHost + 'tour-execution', {params: queryParams});
  }

  startExecution(tourId: number, touristId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution/' + touristId + "/" + tourId, null);
  }

  abandon(id: number): Observable<TourExecution>{
    return this.http.put<TourExecution>(environment.apiHost + 'tour-execution/abandoned', id);
  }

  registerPosition(id: number, position: TouristPosition): Observable<TourExecution>{
    return this.http.put<TourExecution>(environment.apiHost + 'tour-execution/' + id, position);
  }

  getMapObjects(): Observable<PagedResults<MapObject>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'map-object', {params: queryParams});
  }
}
