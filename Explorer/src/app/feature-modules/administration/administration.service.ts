import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ClubMemebrshipRequest } from './model/club-membership-request.model';
import { UserClub } from './model/user-club.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'administration/equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'administration/equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'administration/equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'administration/equipment/' + equipment.id, equipment);
  }

  //club membership requests
  getClubMembershipRequests(): Observable<PagedResults<ClubMemebrshipRequest>> {
    return this.http.get<PagedResults<ClubMemebrshipRequest>>('https://localhost:44333/api/request')
  }
  
  acceptRequest(r: ClubMemebrshipRequest): Observable<ClubMemebrshipRequest> {
    r.status = "Accepted";
    const userClub: UserClub = {
       clubId: r.clubId,
       userId: r.touristId
     };
    this.http.post<ClubMemebrshipRequest>(environment.apiHost + 'user-club', userClub);
    return this.http.put<ClubMemebrshipRequest>(environment.apiHost + 'request/update/' + r.id, r);
  }

  rijectRequest(r: ClubMemebrshipRequest): Observable<ClubMemebrshipRequest> {
    r.status = "Rijected";
    return this.http.put<ClubMemebrshipRequest>(environment.apiHost + 'request/update/' + r.id, r);
  }

}
