import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Encounter } from '../../encounters/model/encounter.model';

@Component({
  selector: 'xp-completed-encounter',
  templateUrl: './completed-encounter.component.html',
  styleUrls: ['./completed-encounter.component.css']
})
export class CompletedEncounterComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Encounter) { }
}
