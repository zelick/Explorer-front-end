import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
import { ReportedIssue } from '../model/reported-issue.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { DatePipe } from '@angular/common';
import { TourIssueComment } from '../../tour-authoring/model/tour-issue-comment';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';


@Component({
  selector: 'xp-reported-issues',
  templateUrl: './reported-issues.component.html',
  styleUrls: ['./reported-issues.component.css'],
  providers: [DatePipe]
})
export class ReportedIssuesComponent implements OnInit{

  reportedIssues: ReportedIssue[] = [];
  selectedReportedIssue: ReportedIssue;
  shouldRenderAllAgain: boolean = false;
  newCommentString: string='';
  newComment: TourIssueComment;

  constructor(private service: AdministrationService, private authservice: AuthService) {
    this.newComment = {
      creationTime: new Date(),
      creatorId: 0, 
      text: ''
    };
  }
  

  ngOnInit(): void{
    this.getReportedIssues();
  }
  selectReportedIssue(issue: any): void {
    this.selectedReportedIssue = issue;
  }
  
  getReportedIssues(): void{
    this.service.getReportedIssues().subscribe({
      next:(result:PagedResults<ReportedIssue>)=>{
        this.reportedIssues = result.results;
        this.selectedReportedIssue = this.reportedIssues[0];
      },
      error: ()=>{

      }
    })
  }
  isUnresolvedAndOlderThan5Days(ri: ReportedIssue): boolean {
    if (ri.resolved) {
      return false; // Return false for resolved issues
    }
    const currentTime = new Date().getTime();
    const issueTime = new Date(ri.time).getTime();
    const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    return currentTime - issueTime > fiveDaysInMillis;
  }
  
  addComment() {
    if (this.selectedReportedIssue && this.selectedReportedIssue.id) {
      if (this.newCommentString.trim() !== '') {
        this.newComment.creationTime = new Date();
        this.newComment.creatorId = this.authservice.user$.value.id;
        this.newComment.text = this.newCommentString;
        this.service.addCommentOnReportedIssue(this.selectedReportedIssue?.id, this.newComment).subscribe(
          (result: ReportedIssue) => {
            this.selectedReportedIssue = result;
          },
          (error) => {
            alert("nista");
          }
        );
      } else {
        alert("You can't publish an empty comment.");
      }
    } else {
    }
  }
  
  
  
  
  
}
