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
import { Tour } from '../../tour-authoring/model/tour.model';
import { PublicCheckpoint } from '../model/public_checkpoint.model';
import { Encounter } from '../../encounters/model/encounter.model';

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
  completedCheckpoint: Checkpoint[]=[];
  mapObjects: MapObject[] = [];
  publicCheckpoints: PublicCheckpoint[] = [];
  encounters : Encounter[] = [];

  constructor(private service: TourExecutionService, private authService: AuthService, private activatedRoute: ActivatedRoute, private changeDetection: ChangeDetectorRef) 
  { 
  }

  ngOnInit(): void {
    this.notifications = [];

    this.service.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.service.getPublicCheckpoints().subscribe( result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });

    this.activatedRoute.params.subscribe(params=>{
      this.tourId = params['tourId'];
      this.authService.user$.subscribe(user => {
      this.tourist = user;

      this.service.getTourExecution(this.tourist.id).subscribe(result => {
        if(result != null)
        {
          this.tourExecution = result;  
          this.tour = result.tour;    
          this.findCheckpoints();
        }else{
          this.service.startExecution(this.tourId).subscribe( result =>{
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
      if(this.publicCheckpoints.length > 0)
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
            this.tour = result.tour;
            console.log("IZVRSENO");
            console.log(this.tourExecution);
            this.findCheckpoints();
            this.service.getEncounters(this.tourId, this.simulatorComponent.selectedPosition.longitude, this.simulatorComponent.selectedPosition.latitude).subscribe(result => {
              this.encounters = result;
            });
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
      if(this.tour.tourTimes != undefined)
      {
        this.tour.tourTimes.forEach(element => {
          this.simulatorComponent.addCheckpoint(coords, element.transportation);
        });
      }
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
    if(this.publicCheckpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.publicCheckpoints[0].latitude, lon: this.publicCheckpoints[0].longitude, picture: this.publicCheckpoints[0].pictures[0], name: this.publicCheckpoints[0].name, desc: this.publicCheckpoints[0].description}];
      this.publicCheckpoints.forEach(e => {
          if(e != this.publicCheckpoints[0])
            if((e.latitude > (this.publicCheckpoints[0].latitude - 2) && (e.latitude < this.publicCheckpoints[0].latitude + 2))
            && ((e.longitude > this.publicCheckpoints[0].longitude - 2) && (e.longitude < this.publicCheckpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.simulatorComponent.addPublicCheckpoints(coords);
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
    this.tourExecution.completedCheckpoints?.forEach(element => {
      var c = this.tour.checkpoints.filter(n => n.id == element.checkpointId);
      if(this.completedCheckpoint.indexOf(this.completedCheckpoint.filter(n=>n.id==element.checkpointId)[0])==-1)
        this.completedCheckpoint.push(c[0]);
    });
    this.completedCheckpoint.forEach(element => {
      if(element.currentPicture==undefined)
      {
        element.currentPicture=0;
        element.showedPicture=element.checkpointSecret?.pictures[element.currentPicture]||"";
      }
      if(element.visibleSecret==undefined)
        element.visibleSecret=false;
      if(element.viewSecretMessage==undefined)
        element.viewSecretMessage="Show secret";
      if(element.currentPointPicture==undefined)
        element.currentPointPicture=0;
      if(element.showedPointPicture==undefined)
      element.showedPointPicture=element.pictures[element.currentPointPicture];
    });
    this.changeDetection.detectChanges();

  }


  OnViewSecret(c:Checkpoint):void{
    c.visibleSecret=!c.visibleSecret;
    c.showedPicture=c.checkpointSecret?.pictures[c.currentPicture]||"";
    if(c.viewSecretMessage=="Show secret")
      c.viewSecretMessage="Hide secret";
    else
      c.viewSecretMessage="Show secret";
  }

  OnNext(c:Checkpoint):void{
   let secretPicturesLength= c.checkpointSecret?.pictures.length||0;
   if(c.currentPicture==(secretPicturesLength-1))
      c.currentPicture=0;
    else
      c.currentPicture=c.currentPicture+1;
      c.showedPicture=c.checkpointSecret?.pictures[c.currentPicture]||"";

  }

  OnPictureNext(c:Checkpoint):void{
    let picturesLength= c.pictures.length;
   if(c.currentPointPicture==(picturesLength-1))
      c.currentPointPicture=0;
    else
      c.currentPointPicture=c.currentPointPicture+1;
      c.showedPointPicture=c.pictures[c.currentPointPicture]||"";
  }

  OnPictureBack(c:Checkpoint):void{
    let picturesLength= c.pictures.length;
   if(c.currentPointPicture==0)
      c.currentPointPicture=(picturesLength-1);
    else
      c.currentPointPicture=c.currentPointPicture-1;
      c.showedPointPicture=c.pictures[c.currentPointPicture]||"";
  }
}



