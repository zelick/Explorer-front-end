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
  equipment: Equipment;
  isVisible: boolean = false;
  showButtonText: string = 'Show equipment';

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
   this.activatedRoute.params.subscribe(params => {
    let id=params['id'];
    this.getTour(id);
   })
  }

  getTour(id: number): void {
    this.service.get(id).subscribe((result: Tour) => {
      this.tour = result;
    });
  }

  removeEquipment(tourId?: number, equipmentId?: number): void {
    if(tourId !== undefined && equipmentId !== undefined){
      this.service.removeEquipment(tourId, equipmentId).subscribe({
        next: (result: Tour) => {
          this.tour = result;
        },
        error: () => {
        }
      })
    }
  }

  onShowEquipmentClick(): void {
    if(this.isVisible){
      this.isVisible = false;
      this.showButtonText = 'Show equipment';
    }
    else{
      this.isVisible = true;
      this.showButtonText = 'Hide equipment';
    }
  }

}
