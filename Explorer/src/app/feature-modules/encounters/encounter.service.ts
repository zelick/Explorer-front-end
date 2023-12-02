import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Encounter } from './model/encounter.model';

@Injectable({
  providedIn: 'root'
})
export class EncounterService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  addEncounter(encounter: FormData,id:number,isPrerequisite:boolean): Observable<Encounter> {
    //let queryParams = new HttpParams();
    //queryParams = queryParams.append("checkpointId", id);
    //queryParams = queryParams.append("isSecretPrerequisite", isPrerequisite);
    const params = new HttpParams()
                    .set('checkpointId', id)
                    .set("isSecretPrerequisite", isPrerequisite);
    return this.http.post<Encounter>(environment.apiHost + 'administration/encounter', encounter,{params});
  }
}
