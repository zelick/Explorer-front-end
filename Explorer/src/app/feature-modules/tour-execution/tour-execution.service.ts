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
import { PublicCheckpoint } from './model/public_checkpoint.model';
import { PrivateTourExecution } from '../tour-authoring/model/private-tour-execution.model';
import { PrivateTour } from '../tour-authoring/model/private-tour.model';

@Injectable({
  providedIn: 'root'
})
export class TourExecutionService {

  constructor(private http: HttpClient) { }
  getTourExecution(tourId: number): Observable<TourExecution> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("tourId",tourId);
    return this.http.get<TourExecution>(environment.apiHost + 'tour-execution', {params: queryParams});
  }

  getPrivateTour(id: number): Observable<PrivateTour> {
    return this.http.get<PrivateTour>(environment.apiHost + 'tourist/privateTours/tour/' + id);
  }

  nextCheckpoint(tour: PrivateTour): Observable<PrivateTour>{
    return this.http.put<PrivateTour>(environment.apiHost + 'tourist/privateTours/next-checkpoint', tour);
  }

  start(tour: PrivateTour): Observable<PrivateTour>{
    return this.http.put<PrivateTour>(environment.apiHost + 'tourist/privateTours/start', tour);
  }

  finish(tour: PrivateTour): Observable<PrivateTour>{
    return this.http.put<PrivateTour>(environment.apiHost + 'tourist/privateTours/finish', tour);
  }

  startExecution(tourId: number): Observable<TourExecution>{
    return this.http.post<TourExecution>(environment.apiHost + 'tour-execution' + "/" + tourId, null);
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

  getPublicCheckpoints(): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint');
  }
}
