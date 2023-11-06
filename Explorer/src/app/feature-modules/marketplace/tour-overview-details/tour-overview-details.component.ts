import { Component,OnInit ,ViewChild} from '@angular/core';
import { TourPreview } from '../model/tour-preview';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Router } from '@angular/router';
import { CheckpointPreview } from '../model/checkpoint-preview';


@Component({
  selector: 'xp-tour-overview-details',
  templateUrl: './tour-overview-details.component.html',
  styleUrls: ['./tour-overview-details.component.css']
})
export class TourOverviewDetailsComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(private service: MarketplaceService,private activatedRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
     this.tourID=params['id'];
     this.getPublishedTour(this.tourID);
   })
 }
    tour:TourPreview;
    tourID:number;
    checkpoints:CheckpointPreview;
    profiles: string[] = ['walking', 'cycling', 'driving'];
    profile: string = this.profiles[0];

    route(): void{
      let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints.latitude, lon: this.checkpoints.longitude}];

            coords.push({lat:this.checkpoints.latitude, lon:this.checkpoints.longitude});

      this.mapComponent.setRoute(coords, this.profile);
    }
  
    ngAfterViewInit(): void {
      if(this.checkpoints != null)
      {
         let coords: [{lat: number, lon: number}] = [{lat: this.checkpoints.latitude, lon: this.checkpoints.longitude}];

             coords.push({lat:this.checkpoints.latitude, lon:this.checkpoints.longitude});

         this.mapComponent.setRoute(coords, 'walking');
    }
  }
    getPublishedTour(id: number): void {
      this.service.getPublishedTour(id).subscribe((result: TourPreview) => {
        this.tour = result;
        console.log(this.tour);
        this.checkpoints=this.tour.checkpoint;
        if(this.checkpoints != null)
        { 
          this.route();
        } 
    
      });
    }

    onBack():void{
      this.router.navigate([`tour-overview`]);

    }

    onAddToCart():void{

    }
}
