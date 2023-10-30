import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit {

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }

  tour:Tour;
  id:number;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
     this.id=params['id'];
     this.getTour(this.id);
   })
 }

  availableEquipment: Equipment[];
  currentEquipmentIds: number[] = [];
  isVisibleEquipment: boolean = false;
  isVisibleAvailableEquipment: boolean = false;
  showButtonText: string = 'Show equipment';
  showAvailableButtonText: string = 'Show available equipment';


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
    if(this.tour.id !== undefined){
      this.service.getAvailableEquipment(currentEquipmentIds, this.tour.id).subscribe((result: Equipment[]) => {
        this.availableEquipment = result;
      })
    }
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

  showCheckpoints():void{
    this.router.navigate([`checkpoint/${this.id}`]);

  }
  showTours():void{
    this.router.navigate([`tour-form/${this.id}`]);

  }
}
