import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ReportedIssue } from '../../administration/model/reported-issue.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';


@Component({
  selector: 'xp-reporting-issue',
  templateUrl: './reporting-issue.component.html',
  styleUrls: ['./reporting-issue.component.css']
})
export class ReportingIssueComponent implements OnChanges {
  reportingIssueForm = new FormGroup({
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    time: new FormControl(new Date(), [Validators.required]),
    tourId: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    touristId: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  });

  constructor(private service: MarketplaceService, private authService: AuthService) {}

  ngOnChanges(): void {
    this.reportingIssueForm.reset();
  }

  addReportedIssue(): void {
    let priorityValue = 0;
    if(this.reportingIssueForm.value.priority){
      priorityValue = +this.reportingIssueForm.value.priority;
    }
    let tourIdValue = 0;
    if(this.reportingIssueForm.value.tourId){
      tourIdValue = +this.reportingIssueForm.value.tourId;
    }
    const user = this.authService.user$.getValue();


    if (priorityValue !== null && tourIdValue !== null && user !== null) {
      const message = this.reportingIssueForm.value.category + "/"+ this.reportingIssueForm.value.description+
      "/"+priorityValue+"/"+tourIdValue+"/"+user.id;


      this.service.addReportedIssue(message).subscribe({
        next: () => {
          alert('Problem reported successfully.')
          this.reportingIssueForm.reset();}
      });
    }
  }
}


