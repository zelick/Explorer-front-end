import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NgModel, NgForm } from '@angular/forms';
import { CheckpointFormComponent } from '../checkpoint-form/checkpoint-form.component';
import { Tour } from '../model/tour.model';
import { TourTime } from '../model/tourTime.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Observable } from 'rxjs';
import { TourTransportFormComponent } from '../tour-transport-form/tour-transport-form.component';
import { TourTimes } from '../model/tourTimes.model';


@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit{
    @ViewChild(CheckpointFormComponent) checkpointFormComponent: CheckpointFormComponent;
    @ViewChild(MapComponent) mapComponent: MapComponent;
    @ViewChild(TourTransportFormComponent) transportComponent: TourTransportFormComponent;
    @Output() tourUpdated = new EventEmitter<null>();

    checkpoints: Checkpoint[] = [];
    shouldRenderCheckpointForm: boolean = false;
    shouldEdit: boolean = false;
    tourID: number;
    tour: Tour;
    selectedCheckpoint: Checkpoint;
    distance: number;
    time: number;
    profiles: string[] = [];
    profile: string = this.profiles[0];
    tourTimes: TourTime[];


    constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params=>{
       this.tourID=params['id'];
       this.service.get(this.tourID).subscribe((result: Tour) => {  
          this.tour = result;
          this.checkpoints = this.tour.checkpoints || [];
          this.tourTimes = this.tour.tourTimes;
          this.fillProfiles();
       });
     });
   }

   route(): void{
    let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
    this.checkpoints.forEach(e => {
        if(e != this.checkpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    if(coords.length >= 2)
    {
      this.mapComponent.setRoute(coords, this.profile.toString());
      this.fillProfiles();
    }
  }

   ngAfterViewInit(): void {
    if(this.checkpoints != null && this.checkpoints.length > 0)
    {
       let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
       this.checkpoints.forEach(e => {
           if(e != this.checkpoints[0])
             coords.push({lat:e.latitude, lon:e.longitude});
       });
       this.mapComponent.setRoute(coords, this.profile.toString());
       this.fillProfiles();
    }
  }

    onAddCheckpoint(): void{
      let tour: Tour;
      this.service.get(this.tourID).subscribe({
        next: (result: Tour) => {
          tour = result;
          if(tour != null)
          {
            this.shouldRenderCheckpointForm = true;
          }else{
            alert("No Tour with that id");
          }
        },
        error: () => {
        }
      })
    }


    getCheckpoints(): void{
      this.service.getCheckpoints().subscribe({
        next: (result: PagedResults<Checkpoint>) => {
          this.checkpoints = result.results;
        },
        error: () => {
        }
      })
    }
    onEdit(c: Checkpoint): void{
      this.selectedCheckpoint = c;
      this.shouldRenderCheckpointForm = true;
      this.shouldEdit = true;
    }

    onDelete(id: number): void{
      this.service.deleteCheckpoint(id).subscribe({
        next: () => {
          this.tourUpdated.emit();
          location.reload();
        },
      })
    }

    onBack():void{
      this.router.navigate([`tour-equipment/${this.tourID}`]);
    }

    updateTour(): void{
        var tourTime: TourTime = {timeInSeconds: this.time, distance: this.distance, transportation: this.profile};
        this.tour.tourTimes.push(tourTime);
        this.tourTimes = this.tour.tourTimes || [];
        var tourTimes: TourTimes = {tourTimes: this.tour.tourTimes}
        this.service.addTourTransportation(this.tourID, tourTimes).subscribe({
          next: () => 
          { 
            this.tourUpdated.emit();
          }
        });
    }

    calculateTimeForCheckpoints(): number{
      let sum = 0;
      for(let c of this.checkpoints)
        sum += c.requiredTimeInSeconds || 0;

      return sum + (this.time || 0);
    }

    updateProfiles($event : any): void{
      this.profiles = this.transportComponent.chosenProfiles;
      this.fillTourTimes();
      this.profile = this.profiles[0];
      this.tour.tourTimes = [];
      this.profiles.forEach(p => {
        this.profile = p;
        this.route()
      });
    }

    getTimeAndDistance(event: {d: number}): void{
      this.time = this.mapComponent.time;
      this.distance = this.mapComponent.dist;
      this.profile = this.mapComponent.profile;
      this.updateTour();
    }

    fillProfiles(): void{
      this.profiles = [];
      this.tourTimes.forEach(e => {
        if(!this.profiles.includes(e.transportation))
        this.profiles.push(e.transportation);
      });
    }

    fillTourTimes(): void{
      var times: TourTime[] = this.tourTimes;
      this.tourTimes = [];
      times.forEach(e => {
        if(this.transportComponent.chosenProfiles.includes(e.transportation))
          this.tourTimes.push(e);
      });
    }
}
