import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ReportedIssue } from './model/reported-issue.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  constructor(private http: HttpClient) { }

  addReportedIssue(reportedIssue: ReportedIssue): Observable<ReportedIssue> {
    return this.http.post<ReportedIssue>(environment.apiHost + 'tourist/reportingIssue', reportedIssue);
  }
}
