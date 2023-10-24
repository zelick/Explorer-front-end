import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TourAuthoringService } from '../tour-authoring.service';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'xp-checkpoint',
  templateUrl: './checkpoint.component.html',
  styleUrls: ['./checkpoint.component.css']
})
export class CheckpointComponent{
    checkpoints: Checkpoint[] = [];
    shouldRenderCheckpointForm: boolean = false;
    shouldEdit: boolean = false;
    shouldRenderCheckpointList: boolean = false;
    tourID: number;
    selectedCheckpoint: Checkpoint;

    constructor(private service: TourAuthoringService) { }

    onAddCheckpoint(): void{
      this.shouldRenderCheckpointForm = true;
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
      }else{
        this.service.getCheckpoints().subscribe({
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
}
