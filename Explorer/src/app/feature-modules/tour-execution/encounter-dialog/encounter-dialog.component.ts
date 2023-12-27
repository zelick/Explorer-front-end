import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Encounter } from '../../encounters/model/encounter.model';
import { EncounterExecution } from '../../encounters/model/encounterExecution.model';
import { TourExecutionService } from '../tour-execution.service';
import { DialogData } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-encounter-dialog',
  templateUrl: './encounter-dialog.component.html',
  styleUrls: ['./encounter-dialog.component.css']
})
export class EncounterDialogComponent {

  longitude: number;
  latitude: number;
  encounterExecution: EncounterExecution;
  constructor(public dialogRef: MatDialogRef<EncounterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private imageService: ImageService) { }
  
  onActivate(): void{
      this.dialogRef.close("Activate");
  }

  onComplete(): void{
      this.dialogRef.close("Complete");
  }

  onClose(): void{
    this.dialogRef.close();
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}
