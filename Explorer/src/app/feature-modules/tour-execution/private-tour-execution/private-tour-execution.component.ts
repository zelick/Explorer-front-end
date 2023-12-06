import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourExecutionService } from '../tour-execution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { PrivateTour } from '../../tour-authoring/model/private-tour.model';
import { MapComponent } from 'src/app/shared/map/map.component';

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
  @ViewChild(MapComponent) mapComponent: MapComponent;
  tour : PrivateTour = {touristId:0, name:"", id: 0, checkpoints:[]};
  tourId: number = 0;
  tourist: User;
  checkPositions: any;
  completedCheckpoint: Checkpoint[]=[];
  startVisibility: boolean = false;
  nextVisibility: boolean = false;
  finishVisibility: boolean = false;
  currentCheckpoint: string = "";
  transport: string = "walking";

  constructor(private router: Router, private service: TourExecutionService, private authService: AuthService, private activatedRoute: ActivatedRoute, private changeDetection: ChangeDetectorRef) 
  { 
  }

  changeTransport(tr:string){
    if(this.transport!==tr){
      this.transport = tr;
      this.mapComponent.reloadMap();
      this.addPublicCheckpointsOnMap();
    }
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(params=>{
      this.tourId = params['id'];
      this.tourist = this.authService.user$.value;

      this.service.getPrivateTour(this.tourId).subscribe(result => {
        if(result != null)
        {
          this.tour = result;
          if(this.tour.execution){
            this.currentCheckpoint = this.tour.checkpoints[this.tour.execution?.lastVisited].name;
          }
          this.updateButtonVisibilities();
          this.addPublicCheckpointsOnMap();
        }
      });
    });
  }

  ngAfterViewInit(): void{
    this.updateButtonVisibilities();
  }

  addPublicCheckpointsOnMap(): void{
    //this.mapComponent.reloadMap();
    if(this.tour.checkpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.tour.checkpoints[0].latitude, lon: this.tour.checkpoints[0].longitude, picture: this.tour.checkpoints[0].pictures[0], name: this.tour.checkpoints[0].name, desc: this.tour.checkpoints[0].description}];
      this.tour.checkpoints.forEach(e => {
          if(e != this.tour.checkpoints[0])
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      if(this.tour.execution)
        this.mapComponent.setRouteWithPublicInfo(coords,this.transport,this.tour.execution?.lastVisited+1); 
    }
  }

  ngOnDestroy() {
    clearInterval(this.checkPositions);
  }

  nextCheckpoint(tour: PrivateTour){
    this.service.nextCheckpoint(tour).subscribe( result => {
      this.updateButtonVisibilities();
      this.tour = result;
      console.log("Checkpoint passed");
      this.service.getPrivateTour(this.tourId).subscribe(result => {
        if(result != null){
          this.tour = result;
          if(this.tour.execution){
            this.currentCheckpoint = this.tour.checkpoints[this.tour.execution?.lastVisited].name;
            this.changeDetection.detectChanges();
          }
          this.addPublicCheckpointsOnMap();
        }
      });
  });
  }

  finish(tour: PrivateTour){
    this.service.finish(tour).subscribe( result => {
      this.updateButtonVisibilities();
      this.tour = result;
      if(this.tour.execution?.lastVisited)
        this.tour.execution.lastVisited ++;
      console.log("Private tour has been finished.");
      this.router.navigate(['/my-profile/private-tours']);
  });
  }

  updateButtonVisibilities(): void {
    this.service.getPrivateTour(this.tourId).subscribe(result => {
      if(result != null){
        this.tour = result;
        if(this.tour.execution){
          this.startVisibility = !this.tour.execution?.startDate;
          if(this.tour.execution?.startDate){
            this.nextVisibility = this.tour.execution.lastVisited != (this.tour.checkpoints.length-1);
          }
          else{
            this.nextVisibility = false;
          }
          this.finishVisibility = this.tour.execution?.lastVisited === (this.tour.checkpoints.length-1);
        }
        this.changeDetection.detectChanges();
      }
    });
  }
}