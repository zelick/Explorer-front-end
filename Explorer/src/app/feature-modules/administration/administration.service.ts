import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Account } from './model/account.model';
import { ReportedIssue } from './model/reported-issue.model';

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

  getAccounts(): Observable<PagedResults<Account>> {
    return this.http.get<PagedResults<Account>>(environment.apiHost + 'administration/accountsManagement')
  }

  block(id: number): Observable<PagedResults<Account>> {
    return this.http.put<PagedResults<Account>>(environment.apiHost + 'administration/accountsManagement/block/' + id, null);
  }
  
  getReportedIssues(): Observable<PagedResults<ReportedIssue>>{
    return this.http.get<PagedResults<ReportedIssue>>(environment.apiHost + 'administration/reportedIssues');
  }
}
