import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkpoint } from './model/checkpoint.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  constructor(private http: HttpClient) { }

  getCheckpoints(): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint')
  }

  getCheckpointsByTour(id: number): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint/' + id)
  }
  
  deleteCheckpoint(id: number): Observable<Checkpoint> {
    return this.http.delete<Checkpoint>(environment.apiHost + 'administration/checkpoint/' + id);
  }

  addCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(environment.apiHost + 'administration/checkpoint', checkpoint);
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/' + checkpoint.id, checkpoint);
  }
  
}
