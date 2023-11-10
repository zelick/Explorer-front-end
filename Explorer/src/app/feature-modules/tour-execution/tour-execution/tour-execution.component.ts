import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { CheckpointPreview } from '../../marketplace/model/checkpoint-preview';
import { MapObject } from '../../tour-authoring/model/map-object.model';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'xp-tour-execution',
  templateUrl: './tour-execution.component.html',
  styleUrls: ['./tour-execution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourExecutionComponent implements OnInit, AfterViewInit{
  @ViewChild(SimulatorComponent) simulatorComponent: SimulatorComponent;
  tour : PurchasedTourPreview;
  tourId: number = 0;
  tourExecution: TourExecution; 
  tourist: User;
  oldPosition: TouristPosition;
  shouldRenderSimulator: boolean = false;
  notifications: number[]=[1];
  checkPositions: any;
  completedCheckpoint: CheckpointPreview[];
  mapObjects: MapObject[] = [];

  constructor(private service: TourExecutionService, private authService: AuthService, private activatedRoute: ActivatedRoute, private changeDetection: ChangeDetectorRef) 
  { 
  }

  ngOnInit(): void {
    this.notifications = [];

    this.service.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.activatedRoute.params.subscribe(params=>{
      this.tourId = params['tourId'];
      this.authService.user$.subscribe(user => {
      this.tourist = user;

      this.service.getTourExecution(this.tourist.id, this.tourId || 0).subscribe(result => {
        if(result != null)
        {
          this.tourExecution = result;  
          this.tour = result.tour;    
          this.findCheckpoints();
        }else{
          this.service.startExecution(this.tourId, this.tourist.id).subscribe( result =>{
            this.tourExecution = result;  
            this.tour = result.tour; 
            this.findCheckpoints();
          });
        }
      });
    });
  });

  this.checkPositions = setInterval(() => {
    this.checkPosition();
  }, 10000);

  }

  ngAfterViewInit(): void{
    if(this.tour != null)
      this.addCheckpointsOnMap();
    if(this.mapObjects.length > 0)
      this.addMapObjectsOnMap();
  }

  checkPosition(): void{
    if(this.oldPosition != this.simulatorComponent.selectedPosition){
      if(this.oldPosition == undefined)
        this.oldPosition = this.simulatorComponent.selectedPosition;
      if(this.simulatorComponent.selectedPosition != undefined)
      {
        this.service.registerPosition(this.tourExecution.id || 0, this.simulatorComponent.selectedPosition).subscribe( result => {
            this.tourExecution = result;
            this.tour = result.tour;
            this.findCheckpoints();
        });
      }
      this.oldPosition = this.simulatorComponent.selectedPosition;
      this.notifications = [];
    }
    console.log("Check position");
    this.notifications.push(1);
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

  addMapObjectsOnMap(): void{
    if(this.mapObjects)
    {
      let coords: [{lat: number, lon: number, category: string}] = [{lat: this.mapObjects[0].latitude, lon: this.mapObjects[0].longitude, category: this.mapObjects[0].category}];
      this.mapObjects.forEach(e => {
          if(e != this.mapObjects[0])
            if((e.latitude > this.tour.checkpoints[0].latitude - 5 && e.latitude < this.tour.checkpoints[0].latitude + 5)
            && (e.longitude > this.tour.checkpoints[0].longitude - 5 && e.longitude < this.tour.checkpoints[0].longitude + 5))
            coords.push({lat:e.latitude, lon:e.longitude, category: e.category});
      });
      this.simulatorComponent.addMapObjects(coords);
    }
  }
  abandon(): void{
    this.service.abandon(this.tourExecution.id || 0).subscribe(result => {
      this.tourExecution = result;
      this.tour = result.tour;
      this.findCheckpoints();
    })
  }

  ngOnDestroy() {
    clearInterval(this.checkPositions);
  }

  findCheckpoints(): void{
    this.completedCheckpoint = [];
    this.tourExecution.completedCheckpoints?.forEach(element => {
      var c = this.tour.checkpoints.filter(n => n.id == element.checkpointId);
      this.completedCheckpoint.push(c[0]);
    });
  }
}



