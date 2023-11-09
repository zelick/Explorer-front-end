import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { TourExecution } from '../model/tour_execution.model';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SimulatorComponent } from '../../marketplace/simulator/simulator.component';
import { TouristPosition } from '../../marketplace/model/position.model';
import { PurchasedTourPreview } from '../model/purchased_tour_preview.model';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'xp-tour-execution',
  templateUrl: './tour-execution.component.html',
  styleUrls: ['./tour-execution.component.css']
})
export class TourExecutionComponent implements OnInit, AfterViewInit{
  @ViewChild(SimulatorComponent) simulatorComponent: SimulatorComponent;
  tour : PurchasedTourPreview;
  tourId: number = 0;
  tourExecution: TourExecution; 
  tourist: User;
  oldPosition: TouristPosition;
  shouldRenderSimulator: boolean = false;
  notifications: number[]=[];

  constructor(private service: TourExecutionService, private authService: AuthService, private activatedRoute: ActivatedRoute, private changeDetection: ChangeDetectorRef) 
  { 
  }

  ngOnInit(): void {
    this.notifications = [];
    this.activatedRoute.params.subscribe(params=>{
      this.tourId = params['tourId'];
      this.authService.user$.subscribe(user => {
      this.tourist = user;

      this.service.getTourExecution(this.tourist.id, this.tourId || 0).subscribe(result => {
        this.tourExecution = result;  
        this.tour = result.tour;    
      });
    });
  });

  var intervalID = setInterval(this.checkPosition, 10000);
  }

  ngAfterViewInit(): void{
    this.addCheckpointsOnMap();
  }

  checkPosition(): void{
    if(this.oldPosition != this.simulatorComponent.positions[0]){
      this.simulatorComponent.addTouristPosition(this.simulatorComponent.positions[0]);
    }
    console.log("Check position");
    this.notifications.push(1);
    this.notifications = {...this.notifications};
    this.changeDetection.detectChanges();
  }

  openSimulator(): void{
    this.shouldRenderSimulator = !this.shouldRenderSimulator;
  }

  addCheckpointsOnMap(): void{
    if(this.tour.checkpoints)
    {
      let coords: [{lat: number, lon: number}] = [{lat: this.tour.checkpoints[0].latitude, lon: this.tour.checkpoints[0].longitude}];
      this.tour.checkpoints.forEach(e => {
          if(e != this.tour.checkpoints[0])
            coords.push({lat:e.latitude, lon:e.longitude});
      });
      this.simulatorComponent.addCheckpoint(coords);
    }
  }
}



