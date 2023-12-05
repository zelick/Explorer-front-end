import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PrivateTour } from '../model/private-tour.model';
import { PublicCheckpoint } from "src/app/feature-modules/tour-execution/model/public_checkpoint.model";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TourAuthoringService } from '../tour-authoring.service';
import { Route, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'xp-private-tours',
  templateUrl: './private-tours.component.html',
  styleUrls: ['./private-tours.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('fade', [
      state('0', style({ opacity: 1 })),
      state('1', style({ opacity: 0 })),
      transition('0 <=> 1', animate('500ms ease-in-out'))
    ])
  ]
})

export class PrivateToursComponent implements OnInit, OnDestroy {
  touristId: number = 0;
  privateTours: PrivateTour[] = [];
  currentCheckpointIndex: number[] = [];
  pictureInterval: any;
  readonly PICTURE_COUNT = 2;
  readonly CHECKPOINT_COUNT = 3;

  constructor(private datePipe: DatePipe, private service: TourAuthoringService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
      this.touristId = this.authService.user$.value.id;
      this.service.getPrivateTours(this.touristId).subscribe({
        next:(result)=>{
          this.privateTours = result;
          for(var tour in this.privateTours){
            this.currentCheckpointIndex.push(0);
          }
        },
        error: (error)=>{
          console.log("Error: ", error);
        }
      })
      this.startPictureRotation();
  }

  ngOnDestroy(): void {
    clearInterval(this.pictureInterval);
}

formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return this.datePipe.transform(date, 'short') || '';
  } else {
    return this.datePipe.transform(date.toISOString(), 'short') || '';
  }
}



execute(privateTour: PrivateTour){
  this.service.start(privateTour).subscribe({
    next:()=>{
      this.router.navigate(['/private-tour-execution/', privateTour.id]);
    },
    error: (error: any)=>{
      console.log("Error: ", error);
    }
  });
  
}

startPictureRotation(): void {
  this.pictureInterval = setInterval(() => {
    var i = 0;
    for(var tour of this.privateTours){
      if(this.currentCheckpointIndex[i]<tour.checkpoints.length-1)
        this.currentCheckpointIndex[i]++;
      else
        this.currentCheckpointIndex[i] = 0;
    }
  }, 3000);
}
}
