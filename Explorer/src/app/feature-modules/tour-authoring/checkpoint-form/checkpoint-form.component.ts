import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel, NgForm } from '@angular/forms';
import { Checkpoint } from '../model/checkpoint.model';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges{

  @Output() checkpointUpdated = new EventEmitter<null>();
  @Input() selectedCheckpoint: Checkpoint;
  @Input() shouldEdit: boolean = false;
  @Input() tourID: number = 0;
  picture: string = '';
  pictures: string[] = [];

  constructor(private service: TourAuthoringService) {
  }

  ngOnChanges(): void {
    this.checkpointForm.reset();
    if(this.shouldEdit) {
      this.checkpointForm.patchValue(this.selectedCheckpoint);
      this.pictures = this.selectedCheckpoint.pictures;
      this.tourID = this.selectedCheckpoint.tourId;
    }
  }

  checkpointForm = new FormGroup({
    tourID: new FormControl(this.tourID, [Validators.required]),
    orderNumber: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  pictureForm = new FormGroup({
    picture: new FormControl(this.picture, [Validators.required])
  });

  addCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.checkpointForm.value.longitude || 0,
      latitude: this.checkpointForm.value.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
    };
    this.service.addCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit() }
    });
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.checkpointForm.value.longitude || 0,
      latitude: this.checkpointForm.value.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
    };
    checkpoint.id = this.selectedCheckpoint.id;
    this.service.updateCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit();}
    });
  }

  addPicture(): void{
    this.picture = this.pictureForm.value.picture || '';
    if(this.picture != '')
      this.pictures.push(this.picture);
    this.pictureForm.reset();
  }

  deletePicture(i: number): void{
    this.pictures.splice(i, 1);
  }
}
