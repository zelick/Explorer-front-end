import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckpointPreview } from '../model/checkpoint-preview';


@Component({
  selector: 'xp-composite-keypoint-popup',
  templateUrl: './composite-keypoint-popup.component.html',
  styleUrls: ['./composite-keypoint-popup.component.css']
})
export class CompositeKeypointPopupComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public items: any[], ) {
    console.log(this.items);
  }

  compositeKeyPoints: CheckpointPreview[];

  ngOnInit(): void {
    this.compositeKeyPoints = Object.values(this.items)[0];
  }

}
