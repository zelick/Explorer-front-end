import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Injectable } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { SimulatorComponent } from '../marketplace/simulator/simulator.component';
import { TouristPosition } from '../marketplace/model/position.model';
import { Router } from '@angular/router';
import { PublicCheckpoint } from '../tour-execution/model/public_checkpoint.model';
import { MapObject } from '../tour-authoring/model/map-object.model';
import { TourExecutionService } from '../tour-execution/tour-execution.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MarketplaceService } from '../marketplace/marketplace.service';


@Component({
  selector: 'xp-tourist-current-position',
  templateUrl: './tourist-current-position.component.html',
  styleUrls: ['./tourist-current-position.component.css']
})
export class TouristCurrentPositionComponent implements OnInit, AfterViewInit{
  @ViewChild(SimulatorComponent) simulatorComponent: SimulatorComponent;
  mapObjects: MapObject[] = [];
  publicCheckpoints: PublicCheckpoint[] = [];
  shouldRenderSimulator: boolean = false;
  user:User|undefined;

  constructor(private router:Router,private authService:AuthService, private changeDetection: ChangeDetectorRef,private tourExecutionService:TourExecutionService,
    private marketPlaceService:MarketplaceService) 
  { 
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })


    this.tourExecutionService.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.tourExecutionService.getPublicCheckpoints().subscribe( result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });

  }

  ngAfterViewInit(): void{
    if(this.mapObjects.length > 0)
      this.addMapObjectsOnMap();
      if(this.publicCheckpoints.length > 0)
      this.addPublicCheckpoinsOnMap();
  }

  addMapObjectsOnMap(): void{
    if(this.mapObjects)
    {
      let coords: [{lat: number, lon: number, category: string, name: string, desc: string}] = [{lat: this.mapObjects[0].latitude, lon: this.mapObjects[0].longitude, category: this.mapObjects[0].category, name: this.mapObjects[0].name, desc: this.mapObjects[0].description}];
      this.mapObjects.forEach(e => {
          if(e != this.mapObjects[0])
            coords.push({lat:e.latitude, lon:e.longitude, category: e.category, name: e.name, desc: e.description});
      });
      this.simulatorComponent.addMapObjects(coords);
    }
  }

  addPublicCheckpoinsOnMap(): void{
    if((this.publicCheckpoints).length != 0)
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

  checkPosition(): void{      
      if(this.simulatorComponent.selectedPosition != undefined)
      {
       console.log(this.simulatorComponent.selectedPosition)
       const touristPosition:TouristPosition={
        creatorId: this.user?.id||0,
        latitude: this.simulatorComponent.selectedPosition.latitude,
        longitude: this.simulatorComponent.selectedPosition.longitude
       }
      }
      this.router.navigate([`/`]);

    
    this.changeDetection.detectChanges();
  }

  openSimulator(): void{
    this.shouldRenderSimulator = !this.shouldRenderSimulator;
  }
}
