import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NgModel, NgForm } from '@angular/forms';
import { CheckpointFormComponent } from '../checkpoint-form/checkpoint-form.component';
import { Tour } from '../model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';


@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit{
    @ViewChild(CheckpointFormComponent) checkpointFormComponent: CheckpointFormComponent;
    @ViewChild(MapComponent) mapComponent: MapComponent;
    @Output() tourUpdated = new EventEmitter<null>();
    checkpoints: Checkpoint[] = [];
    shouldRenderCheckpointForm: boolean = false;
    shouldEdit: boolean = false;
    tourID: number;
    tour: Tour;
    selectedCheckpoint: Checkpoint;

    constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params=>{
       this.tourID=params['id'];
       this.service.get(this.tourID).subscribe((result: Tour) => {
        this.tour = result;
        this.checkpoints = this.tour.checkpoints || [];
        this.route();
       });
     });
   }

   route(): void{
    let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
    this.checkpoints.forEach(e => {
        if(e != this.checkpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    this.mapComponent.setRoute(coords, 'walking');
  }

   ngAfterViewInit(): void {
    if(this.checkpoints != null)
    {
       let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
       this.checkpoints.forEach(e => {
           if(e != this.checkpoints[0])
             coords.push({lat:e.latitude, lon:e.longitude});
       });
       this.mapComponent.setRoute(coords, 'walking');
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
        },
      })
    }

    onBack():void{
      this.router.navigate([`tour-equipment/${this.tourID}`]);
    }

    updateTour(event: {distance: number}): void{
      this.tour.distance = event.distance;
      this.service.updateTour(this.tour).subscribe({
        next: () => 
        { 
          this.tourUpdated.emit();
        }
        
      });
    }
}
