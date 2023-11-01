import { Component, OnInit , EventEmitter,Input, ViewChild} from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  tour:Tour;
  checkpoints: Array<Checkpoint> = [];
  profiles: string[] = ['walking', 'cycling', 'driving'];
  profile: string = this.profiles[0];
  availableEquipment: Equipment[];
  currentEquipmentIds: number[] = [];
  isVisibleEquipment: boolean = false;
  isVisibleAvailableEquipment: boolean = false;
  showButtonText: string = 'Show equipment';
  showAvailableButtonText: string = 'Show available equipment';

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }
  tourID:number;
  ngOnInit(): void {
   this.activatedRoute.params.subscribe(params=>{
    this.tourID=params['id'];
    this.getTour(this.tourID);

    this.service.getCheckpointsByTour(this.tourID).subscribe({
      next: (result: PagedResults<Checkpoint>) => {
        this.checkpoints = result.results;
        if(this.checkpoints != null)
      { 
        this.route();
      } 
      }
   });
  })
}
  route(): void{
    let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
    this.checkpoints.forEach(e => {
        if(e != this.checkpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    this.mapComponent.setRoute(coords, this.profile);
  }

  ngAfterViewInit(): void {
    if(this.checkpoints != null)
    {
       let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints[0].latitude, lon: this.checkpoints[0].longitude}];
       this.checkpoints.forEach(e => {
           if(e != this.checkpoints[0])
             coords.push({lat:e.latitude, lon:e.longitude});
       });
       this.mapComponent.setRoute(coords, 'walking');
  }
}
  getTour(id: number): void {
    this.service.get(id).subscribe((result: Tour) => {
      this.tour = result;
      console.log(this.tour.checkpoints);
   
  
    });
  }

  onDelete():void{
    let id=this.tour.id||0;
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.router.navigate([`tour`]);
      },
    })
  }

  onBack():void{
    this.router.navigate([`tour`]);

  }

  onEdit():void{
    this.router.navigate([`tour-form/${this.tourID}`]);
  }

}
