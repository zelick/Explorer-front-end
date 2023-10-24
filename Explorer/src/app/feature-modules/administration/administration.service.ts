import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ApplicationGrade } from './model/applicationGrade.model';
import { Club } from './model/club.model';
import { Account } from './model/account.model';
import { ReportedIssue } from './model/reported-issue.model';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  [x: string]: any;

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

  getAllGrades(): Observable<ApplicationGrade[]> {
    return this.http.get<ApplicationGrade[]>(environment.apiHost + 'administration/applicationGrade');
  }

  noteTheRate(grade: ApplicationGrade): Observable<ApplicationGrade> {
    return this.http.post<ApplicationGrade>(environment.apiHost + 'tour/applicationGrade', grade);

  getClub(): Observable<PagedResults<Club>> {
    return this.http.get<PagedResults<Club>>('https://localhost:44333/api/club');
  }

  addClub(club: Club): Observable<Club> {
    return this.http.post<Club>('https://localhost:44333/api/club', club);
  }

  updateClub(club: Club): Observable<Club> {
    return this.http.put<Club>('https://localhost:44333/api/club/' + club.id, club);
  }

  deleteClub(id: number): Observable<Club> {
    return this.http.delete<Club>('https://localhost:44333/api/club/' + id);
  }

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
