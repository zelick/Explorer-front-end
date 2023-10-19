import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input() tourID: number;

  constructor(private service: TourAuthoringService) {
  }

  ngOnChanges(): void {
    this.checkpointForm.reset();
    if(this.shouldEdit) {
      this.checkpointForm.patchValue(this.selectedCheckpoint);
    }
  }

  checkpointForm = new FormGroup({
    tourID: new FormControl(0, [Validators.required]),
    orderNumber: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    picture: new FormControl('', [Validators.required])
  });

  addCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourID: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.checkpointForm.value.longitude || 0,
      latitude: this.checkpointForm.value.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      picture: this.checkpointForm.value.picture || "",
    };
    this.service.addCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit() }
    });
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourID: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.checkpointForm.value.longitude || 0,
      latitude: this.checkpointForm.value.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      picture: this.checkpointForm.value.picture || "",
    };
    checkpoint.id = this.selectedCheckpoint.id;
    this.service.updateCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit();}
    });
  }

}
