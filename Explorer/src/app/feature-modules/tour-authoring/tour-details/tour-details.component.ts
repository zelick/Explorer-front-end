import { Component, OnInit} from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Equipment } from '../model/equipment.model';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit{
  tour: Tour;
  availableEquipment: Equipment[];
  currentEquipmentIds: number[] = [];
  isVisibleEquipment: boolean = false;
  isVisibleAvailableEquipment: boolean = false;
  showButtonText: string = 'Show equipment';
  showAvailableButtonText: string = 'Show available equipment';

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.getTour(id);
    });
  }
  
  getTour(id: number): void {
    this.service.get(id).subscribe((result: Tour) => {
      this.tour = result;
  
      // Once this.tour is defined, you can safely access its equipment
      this.currentEquipmentIds = this.tour.equipment.map(e => e.id as number);
  
      // Now, call the method that depends on this.tour and its equipment
      this.getAvailableEquipment(this.currentEquipmentIds);
    });
  }

  getAvailableEquipment(currentEquipmentIds: number[]): void{
    this.service.getAvailableEquipment(currentEquipmentIds).subscribe((result: Equipment[]) => {
      this.availableEquipment = result;
    })
  }

  removeEquipment(tourId?: number, equipmentId?: number): void {
    if(tourId !== undefined && equipmentId !== undefined){
      this.service.removeEquipment(tourId, equipmentId).subscribe({
        next: (result: Tour) => {
          this.tour = result;
          this.currentEquipmentIds = this.tour.equipment.map(e => e.id as number);
          this.getAvailableEquipment(this.currentEquipmentIds);
        },
        error: () => {
        }
      })
    }
  }

  addEquipment(tourId?: number, equipmentId?: number): void {
    if(tourId !== undefined && equipmentId !== undefined){
      this.service.addEquipment(tourId, equipmentId).subscribe({
        next: (result: Tour) => {
          this.tour = result;
          this.currentEquipmentIds = this.tour.equipment.map(e => e.id as number);
          this.getAvailableEquipment(this.currentEquipmentIds);
        },
        error: () => {
        }
      })
    }
  }

  onShowEquipmentClick(): void {
    if(this.isVisibleEquipment){
      this.isVisibleEquipment = false;
      this.showButtonText = 'Show equipment';
    }
    else{
      this.isVisibleEquipment = true;
      this.showButtonText = 'Hide equipment';
    }
  }

  onShowAvailableEquipmenClick(): void {
    if(this.isVisibleAvailableEquipment){
      this.isVisibleAvailableEquipment = false;
      this.showAvailableButtonText = 'Show available equipment';
    }
    else{
      this.isVisibleAvailableEquipment = true;
      this.showAvailableButtonText = 'Hide available equipment';
    }
  }


}
