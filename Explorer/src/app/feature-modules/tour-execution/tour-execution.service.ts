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
import { Encounter } from '../encounters/model/encounter.model';
import { EncounterExecution } from '../encounters/model/encounterExecution.model';

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

  getEncounters(tourId: number, touristLongitude: number, touristLatitude: number): Observable<EncounterExecution[]>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("touristLatitude", touristLatitude);
    queryParams = queryParams.append("touristLongitude", touristLongitude);
    return this.http.get<EncounterExecution[]>(environment.apiHost + 'tourist/encounter-execution/get-by-tour/' + tourId, {params: queryParams});
  }
}
