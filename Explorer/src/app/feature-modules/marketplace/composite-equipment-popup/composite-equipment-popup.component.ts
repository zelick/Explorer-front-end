import { Component, Inject,OnInit } from '@angular/core';
import { Equipment } from '../../tour-authoring/model/equipment.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipmentPopup } from '../model/equipment-popup';

@Component({
  selector: 'xp-composite-equipment-popup',
  templateUrl: './composite-equipment-popup.component.html',
  styleUrls: ['./composite-equipment-popup.component.css']
})
export class CompositeEquipmentPopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public items: any[]) {

  }
  compositeEquipment : EquipmentPopup[];

  ngOnInit(): void {
    this.compositeEquipment = Object.values(this.items)[0];
  }
}
