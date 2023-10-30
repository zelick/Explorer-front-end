import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Checkpoint } from './model/checkpoint.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Equipment } from './model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { MapObject } from './model/map-object.model';

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

  getMapObjects(): Observable<PagedResults<MapObject>> {
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'administration/mapObject');
  }

  deleteMapObject(id: number): Observable<MapObject> {
    return this.http.delete<MapObject>(environment.apiHost + 'administration/mapobject/' + id);
  }
  
  addMapObject(mapObject: MapObject): Observable<MapObject> {
    return this.http.post<MapObject>(environment.apiHost + 'administration/mapobject', mapObject);
  }
  
  updateMapObject(mapObject: MapObject): Observable<MapObject> {
    return this.http.put<MapObject>(environment.apiHost + 'administration/mapobject/' + mapObject.id, mapObject);
  }
  
  
  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'administration/tour', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/' + tour.id, tour);
  }

  getTour(id: number): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'administration/tour/by-author/' + id)
  }

  deleteTour(id: number): Observable<Tour> {
    return this.http.delete<Tour>(environment.apiHost + 'administration/tour/' + id);
  }

  get(id:number): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'administration/tour/details/' + id);
  }

  removeEquipment(tourId: number, equipmentId: number): Observable<Tour> {
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/remove/' + tourId + '/' + equipmentId, null);
  }

  addEquipment(tourId: number, equipmentId: number): Observable<Tour>{
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/add/' + tourId + '/' + equipmentId, null);
  }

  getAvailableEquipment(currentEquipmentIds: number[], tourId: number): Observable<Equipment[]> {
    return this.http.post<Equipment[]>(environment.apiHost + 'manipulation/equipment/get-available/' + tourId, currentEquipmentIds);
  }

  publishTour(tourId: number){
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/publishedTours/' + tourId, null);
  }
}