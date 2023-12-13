import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Encounter } from '../../encounters/model/encounter.model';
import { EncounterExecution } from '../../encounters/model/encounterExecution.model';

@Component({
  selector: 'xp-encounter-dialog',
  templateUrl: './encounter-dialog.component.html',
  styleUrls: ['./encounter-dialog.component.css']
})
export class EncounterDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Encounter) { }//data: EncounterExecution) { }
}
