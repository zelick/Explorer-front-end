import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TourExecution } from '../model/tour_execution.model';
import { TourExecutionService } from '../tour-execution.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-abandon-dialog',
  templateUrl: './abandon-dialog.component.html',
  styleUrls: ['./abandon-dialog.component.css']
})
export class AbandonDialogComponent {
  tourExecution: TourExecution;
  constructor(@Inject(MAT_DIALOG_DATA) public data: TourExecution, private service: TourExecutionService, private router: Router){
    this.tourExecution = data;
  }

  onYes(): void{
    this.service.abandon(this.tourExecution.id || 0).subscribe(result => {

      if(result.executionStatus == 'Abandoned'){
        this.router.navigate(['home-page']);
      }
    })
  }
  onNo(): void{
    
  }
}
