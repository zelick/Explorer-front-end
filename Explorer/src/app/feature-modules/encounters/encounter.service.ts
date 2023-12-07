import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Encounter } from './model/encounter.model';
import { EncounterRequest } from './model/encounterRequest.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  addEncounter(encounter: FormData,id:number,isPrerequisite:boolean): Observable<Encounter> {

    const params = new HttpParams()
                    .set('checkpointId', id)
                    .set("isSecretPrerequisite", isPrerequisite);
    return this.http.post<Encounter>(environment.apiHost + 'administration/encounter', encounter,{params});
  }

  addTouristEncounter(encounter: FormData,id:number,isPrerequisite:boolean): Observable<Encounter> {

    const params = new HttpParams()
                    .set('checkpointId', id)
                    .set("isSecretPrerequisite", isPrerequisite);
    return this.http.post<Encounter>(environment.apiHost + 'administration/touristEncounter', encounter,{params});
  }

  getEncounter(id:number): Observable<Encounter> {
    return this.http.get<Encounter>(environment.apiHost + 'administration/encounter/'+id);
  }

  editEncounter(encounter: FormData): Observable<Encounter> {
    return this.http.put<Encounter>(environment.apiHost + 'administration/encounter', encounter);
  }

  deleteEncounter(checkpointId:number): Observable<Encounter> {
    return this.http.delete<Encounter>(environment.apiHost + 'administration/encounter/'+checkpointId);
  }

  getAllRequests(): Observable<PagedResults<EncounterRequest>> {
    return this.http.get<PagedResults<EncounterRequest>>(environment.apiHost + 'administration/encounterRequests');
  }

  acceptRequest(requestId: number): Observable<EncounterRequest> {
    return this.http.put<EncounterRequest>(environment.apiHost + 'administration/encounterRequests/accept/' + requestId, null);
  }

  rejecttRequest(requestId: number): Observable<EncounterRequest> {
    return this.http.put<EncounterRequest>(environment.apiHost + 'administration/encounterRequests/reject/' + requestId, null);
  }

  getAllUsers(): Observable<PagedResults<User>> {
    return this.http.get<PagedResults<User>>('https://localhost:44333/api/user');
  }

  getEncounters(): Observable<PagedResults<Encounter>> {
    return this.http.get<PagedResults<Encounter>>(environment.apiHost + 'administration/touristEncounter');
  }
}
