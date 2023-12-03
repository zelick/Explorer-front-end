import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TourExecution } from '../model/tour_execution.model';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute } from '@angular/router';
import { SimulatorComponent } from '../../marketplace/simulator/simulator.component';
import { TouristPosition } from '../../marketplace/model/position.model';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { MapObject } from '../../tour-authoring/model/map-object.model';
import { PrivateTour } from '../../tour-authoring/model/private-tour.model';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'xp-tour-execution',
  templateUrl: './private-tour-execution.component.html',
  styleUrls: ['./private-tour-execution.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivateTourExecutionComponent implements OnInit, AfterViewInit{
  @ViewChild(SimulatorComponent) simulatorComponent: SimulatorComponent;
  tour : PrivateTour;
  tourId: number = 0;
  tourist: User;
  oldPosition: TouristPosition;
  shouldRenderSimulator: boolean = false;
  notifications: number[]=[1];
  checkPositions: any;
  completedCheckpoint: Checkpoint[]=[];
  mapObjects: MapObject[] = [];
  tourExecution: TourExecution;

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
      this.tourId = params['id'];
      this.authService.user$.subscribe(user => {
      this.tourist = user;

      this.service.getPrivateTour(this.tourId).subscribe(result => {
        if(result != null)
        {
          this.tour = result;   
          this.findCheckpoints();
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
      if(this.tour.checkpoints.length > 0)
      this.addPublicCheckpoinsOnMap();
  }

  checkPosition(): void{
    if(this.oldPosition != this.simulatorComponent.selectedPosition){
      if(this.oldPosition == undefined)
        this.oldPosition = this.simulatorComponent.selectedPosition;
      if(this.simulatorComponent.selectedPosition != undefined)
      {
        this.service.registerPosition(this.tourExecution.id || 0, this.simulatorComponent.selectedPosition).subscribe( result => {
            this.tourExecution = result;
            console.log("IZVRSENO");
            console.log(this.tourExecution);
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
      let coords: [{lat: number, lon: number, name: string, desc: string}] = [{lat: this.tour.checkpoints[0].latitude, lon: this.tour.checkpoints[0].longitude, name: this.tour.checkpoints[0].name, desc: this.tour.checkpoints[0].description}];
      this.tour.checkpoints.forEach(e => {
          if(e != this.tour.checkpoints[0])
            coords.push({lat:e.latitude, lon:e.longitude, name: e.name, desc: e.description});
      });
    }
  }

  addMapObjectsOnMap(): void{
    if(this.mapObjects)
    {
      let coords: [{lat: number, lon: number, category: string, name: string, desc: string}] = [{lat: this.mapObjects[0].latitude, lon: this.mapObjects[0].longitude, category: this.mapObjects[0].category, name: this.mapObjects[0].name, desc: this.mapObjects[0].description}];
      this.mapObjects.forEach(e => {
          if(e != this.mapObjects[0])
            if((e.latitude > (this.tour.checkpoints[0].latitude - 2) && (e.latitude < this.tour.checkpoints[0].latitude + 2))
            && ((e.longitude > this.tour.checkpoints[0].longitude - 2) && (e.longitude < this.tour.checkpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, category: e.category, name: e.name, desc: e.description});
      });
      this.simulatorComponent.addMapObjects(coords);
    }
  }

  addPublicCheckpoinsOnMap(): void{
    if(this.tour.checkpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.tour.checkpoints[0].latitude, lon: this.tour.checkpoints[0].longitude, picture: this.tour.checkpoints[0].pictures[0], name: this.tour.checkpoints[0].name, desc: this.tour.checkpoints[0].description}];
      this.tour.checkpoints.forEach(e => {
          if(e != this.tour.checkpoints[0])
            if((e.latitude > (this.tour.checkpoints[0].latitude - 2) && (e.latitude < this.tour.checkpoints[0].latitude + 2))
            && ((e.longitude > this.tour.checkpoints[0].longitude - 2) && (e.longitude < this.tour.checkpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.simulatorComponent.addPublicCheckpoints(coords);
    }
  }

  ngOnDestroy() {
    clearInterval(this.checkPositions);
  }

  nextCheckpoint(tour: PrivateTour){
    this.service.nextCheckpoint(tour).subscribe( result => {
      this.tour = result;
      console.log("Checkpoint passed");
  });
  }

  start(tour: PrivateTour){
    this.service.start(tour).subscribe( result => {
      this.tour = result;
      console.log("Private tour has been started.");
  });
  }

  finish(tour: PrivateTour){
    this.service.finish(tour).subscribe( result => {
      this.tour = result;
      console.log("Private tour has been finished.");
  });
  }

  findCheckpoints(): void{
    this.tourExecution.completedCheckpoints?.forEach(element => {
      var c = this.tour.checkpoints.filter(n => n.id == element.checkpointId);
    });
    this.completedCheckpoint.forEach(element => {
      if(element.currentPicture==undefined)
      {
        element.currentPicture=0;
      }
      element.showedPointPicture=element.pictures[element.currentPointPicture];
    });
    this.changeDetection.detectChanges();
  }
}