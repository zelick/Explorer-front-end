import { Component, OnInit , EventEmitter,Input, ViewChild} from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../model/checkpoint.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { MapComponent } from 'src/app/shared/map/map.component';


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

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
   this.activatedRoute.params.subscribe(params=>{
    let id=params['id'];
    this.getTour(id);

    this.service.getCheckpointsByTour(id).subscribe({
      next: (result: PagedResults<Checkpoint>) => {
        this.checkpoints = result.results;
        if(this.checkpoints != null)
      { 
        this.route();
      } 
      }
    })
   });
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

  getTour(id:number): void {
    this.service.get(id).subscribe({
      next: (result: Tour) => {
        this.tour = result;
      },
      error: () => {
      }
    })
  }
}
