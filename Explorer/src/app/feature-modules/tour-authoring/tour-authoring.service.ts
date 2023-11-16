import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Checkpoint } from './model/checkpoint.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Equipment } from './model/equipment.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Tour } from './model/tour.model';
import { MapObject } from './model/map-object.model';
import { TourTime } from './model/tourTime.model';
import { TourTimes } from './model/tourTimes.model';
import { CheckpointSecret } from './model/checkpointSecret.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Result } from 'postcss';
import { PublicCheckpoint } from '../tour-execution/model/public_checkpoint.model';


@Injectable({
  providedIn: 'root'
})
export class TourAuthoringService {

  user: User;
  constructor(private http: HttpClient, private authService: AuthService) 
  { 
    this.authService.user$.subscribe( result =>{
      this.user= result;
    });
  }
  
  getCheckpoints(): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint')
  }
  getCheckpoint(id:number): Observable<Checkpoint> {
    return this.http.get<Checkpoint>(environment.apiHost + 'administration/checkpoint/details/'+id);
  }

  getCheckpointsByTour(id: number): Observable<PagedResults<Checkpoint>> {
    return this.http.get<PagedResults<Checkpoint>>(environment.apiHost + 'administration/checkpoint/' + id)
  }
  
  deleteCheckpoint(id: number): Observable<Checkpoint> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.delete<Checkpoint>(environment.apiHost + 'administration/checkpoint/' + id, {params: queryParams});
  }

  addCheckpoint(checkpoint: Checkpoint, userId: number, status: string): Observable<Checkpoint> {
    return this.http.post<Checkpoint>(environment.apiHost +`administration/checkpoint/create/${userId}/${status}`, checkpoint);
  }

  updateCheckpoint(checkpoint: Checkpoint): Observable<Checkpoint> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/' + checkpoint.id, checkpoint, {params: queryParams});
  }

  addCheckpointSecret(checkpointSecret: CheckpointSecret,id:number): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/createSecret/' + id, checkpointSecret);
  }

  updateCheckpointSecret(checkpointSecret: CheckpointSecret,id:number): Observable<Checkpoint> {
    return this.http.put<Checkpoint>(environment.apiHost + 'administration/checkpoint/updateSecret/' + id, checkpointSecret);
  }

  getMapObjects(): Observable<PagedResults<MapObject>> {
    return this.http.get<PagedResults<MapObject>>(environment.apiHost + 'administration/mapObject');
  }

  deleteMapObject(id: number): Observable<MapObject> {
    return this.http.delete<MapObject>(environment.apiHost + 'administration/mapobject/' + id);
  }
  
  addMapObject(mapObject: MapObject, userId: number, status: string, formData: FormData): Observable<MapObject> {
    const options = { headers: new HttpHeaders() };

    formData.append('longitude', mapObject.longitude.toString()),
    formData.append('latitude', mapObject.latitude.toString()),
    formData.append('name', mapObject.name),
    formData.append('category', mapObject.category)
    if (mapObject.picture instanceof File) {
      formData.append('picture', mapObject.picture, mapObject.picture.name);
    }
  
    // Assuming profilePictureUrl is a string
    formData.append('pictureURL', mapObject.pictureURL);
    return this.http.post<MapObject>(environment.apiHost + `administration/mapobject/create/${userId}/${status}`, formData, options);
  }
  
  updateMapObject(mapObject: MapObject, formData: FormData): Observable<MapObject> {
    const options = { headers: new HttpHeaders() };

    formData.append('id', (mapObject.id !== undefined) ? mapObject.id.toString() : '');
    formData.append('longitude', mapObject.longitude.toString()),
    formData.append('latitude', mapObject.latitude.toString()),
    formData.append('name', mapObject.name),
    formData.append('category', mapObject.category)
    if (mapObject.picture instanceof File) {
      formData.append('picture', mapObject.picture, mapObject.picture.name);
    }
  
    // Assuming profilePictureUrl is a string
    formData.append('pictureURL', mapObject.pictureURL);
    return this.http.put<MapObject>(environment.apiHost + 'administration/mapobject/' + mapObject.id, formData, options);
  }
  
  
  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(environment.apiHost + 'administration/tour', tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/' + tour.id, tour, {params: queryParams});
  }

  archiveTour(tour: Tour): Observable<Tour> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/archivedTours/' + tour.id, tour, {params: queryParams});
  }

  getTour(id: number): Observable<Tour[]> {
    return this.http.get<Tour[]>(environment.apiHost + 'administration/tour/by-author/' + id)
  }

  deleteTour(id: number): Observable<Tour> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.delete<Tour>(environment.apiHost + 'administration/tour/' + id, {params: queryParams});
  }

  get(id:number): Observable<Tour> {
    return this.http.get<Tour>(environment.apiHost + 'administration/tour/details/' + id);
  }

  removeEquipment(tourId: number, equipmentId: number): Observable<Tour> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/remove/' + tourId + '/' + equipmentId, null, {params: queryParams});
  }

  addEquipment(tourId: number, equipmentId: number): Observable<Tour>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/add/' + tourId + '/' + equipmentId, null, {params: queryParams});
  }

  getAvailableEquipment(currentEquipmentIds: number[], tourId: number): Observable<Equipment[]> {
    return this.http.post<Equipment[]>(environment.apiHost + 'manipulation/equipment/get-available/' + tourId, currentEquipmentIds);
  }

  publishTour(tourId: number){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/publishedTours/' + tourId, null, {params: queryParams});
  }

  addTourTransportation(tourId: number, tour: TourTimes){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("userId", this.user.id);
    return this.http.put<Tour>(environment.apiHost + 'administration/tour/tourTime/' + tourId, tour, {params: queryParams});
  }

  getPublicCheckpoints(): Observable<PagedResults<PublicCheckpoint>>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", 0);
    queryParams = queryParams.append("pageSize", 0);
    return this.http.get<PagedResults<PublicCheckpoint>>(environment.apiHost + 'administration/publicCheckpoint');
  }
}