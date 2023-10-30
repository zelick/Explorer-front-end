import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NgModel, NgForm } from '@angular/forms';
import { CheckpointFormComponent } from '../checkpoint-form/checkpoint-form.component';
import { Tour } from '../model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent implements OnInit{
    @ViewChild(CheckpointFormComponent) checkpointFormComponent: CheckpointFormComponent;
    checkpoints: Checkpoint[] = [];
    shouldRenderCheckpointForm: boolean = false;
    shouldEdit: boolean = false;
    shouldRenderCheckpointList: boolean = false;
    tourID: number;
    selectedCheckpoint: Checkpoint;

    constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }

    ngOnInit(): void {
      this.activatedRoute.params.subscribe(params=>{
       this.tourID=params['id'];
     })
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

    onSeeCheckpoint(): void{
      this.shouldRenderCheckpointList = true;
      if(this.tourID != null)
      {
        this.service.getCheckpointsByTour(this.tourID).subscribe({
          next: (result: PagedResults<Checkpoint>) => {
            this.checkpoints = result.results;
          },
          error: () => {
          }
        })
      }
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
      this.shouldRenderCheckpointList = false;
    }

    onDelete(id: number): void{
      this.service.deleteCheckpoint(id).subscribe({
        next: () => {
          this.onSeeCheckpoint();
        },
      })
    }

    onBack():void{
      this.router.navigate([`tour-equipment/${this.tourID}`]);

    }
}
