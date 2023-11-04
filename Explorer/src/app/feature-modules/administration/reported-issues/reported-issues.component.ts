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
  user:any;
  newCommentString: string='';
  newComment: TourIssueComment;

  constructor(private service: AdministrationService, private authservice: AuthService) {
    this.user = authservice.user$.value;
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
    if(this.user.role==='administrator'){
      this.service.getReportedIssues().subscribe({
        next:(result:PagedResults<ReportedIssue>)=>{
          this.reportedIssues = result.results;
          this.selectedReportedIssue = this.reportedIssues[0];
        },
        error: ()=>{
  
        }
      })
    }
    else if(this.user.role==='author'){
        this.service.getAuthorsReportedIssues(this.user.id).subscribe({
          next:(result:PagedResults<ReportedIssue>)=>{
            this.reportedIssues = result.results;
            this.selectedReportedIssue = this.reportedIssues[0];
          },
          error: ()=>{
    
          }
        })
    }
    else if(this.user.role==='tourist'){
        this.service.getTouristsReportedIssues(this.user.id).subscribe({
          next:(result:PagedResults<ReportedIssue>)=>{
            this.reportedIssues = result.results;
            this.selectedReportedIssue = this.reportedIssues[0];
          },
          error: ()=>{
    
          }
        })
    }
    
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
  resolve(){
    if(this.selectedReportedIssue && this.selectedReportedIssue.id)
    this.service.resolveReportedIssue(this.selectedReportedIssue?.id).subscribe(
      (result: ReportedIssue) => {
        this.selectedReportedIssue = result;
        this.newCommentString = '';
      },
      (error) => {
        alert("nista");
      }
    );
  }
  addComment() {
    if (this.selectedReportedIssue && this.selectedReportedIssue.id) {
      if (this.newCommentString.trim() !== '') {
        if(this.user.role==='administrator'){
          this.newComment.creationTime = new Date();
          this.newComment.creatorId = this.user.id;
          this.newComment.text = this.newCommentString;
          this.service.addAdministratorCommentOnReportedIssue(this.selectedReportedIssue?.id, this.newComment).subscribe(
            (result: ReportedIssue) => {
              this.selectedReportedIssue = result;
              this.newCommentString = '';
            },
            (error) => {
              alert("nista");
            }
          );
        }
        else if(this.user.role==='author'){
          this.newComment.creationTime = new Date();
          this.newComment.creatorId = this.user.id;
          this.newComment.text = this.newCommentString;
          this.service.addAuthorCommentOnReportedIssue(this.selectedReportedIssue?.id, this.newComment).subscribe(
            (result: ReportedIssue) => {
              this.selectedReportedIssue = result;
              this.newCommentString = '';
            },
            (error) => {
              alert("nista");
            }
          );
        }
        else if(this.user.role==='tourist'){
          this.newComment.creationTime = new Date();
          this.newComment.creatorId = this.user.id;
          this.newComment.text = this.newCommentString;
          this.service.addTouristCommentOnReportedIssue(this.selectedReportedIssue?.id, this.newComment).subscribe(
            (result: ReportedIssue) => {
              this.selectedReportedIssue = result;
              this.newCommentString = '';
            },
            (error) => {
              alert("nista");
            }
          );
        }
      } else {
        alert("You can't publish an empty comment.");
      }
    } else {
    }
  }
  
  
  
  
  
}
