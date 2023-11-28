import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
  selector: 'xp-plan-your-trip',
  templateUrl: './plan-your-trip.component.html',
  styleUrls: ['./plan-your-trip.component.css']
})
export class PlanYourTripComponent implements OnInit, AfterViewInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  selectedDestination: string;
  publicCheckpoints: PublicCheckpoint[];
  selectedCheckpoints: PublicCheckpoint[] = [];
  mode: string = "Map";
  selectedLatitude: number;
  selectedLongitude: number;
  
  constructor(private mapService: MapService, private tourAuthoringService: TourAuthoringService){

  }
  ngAfterViewInit(): void {
    if(this.selectedCheckpoints.length > 0)
    this.addPublicCheckpointsOnMap();
  }
  ngOnInit(): void {
  }
  changeMode(){
    if(this.mode === "Map"){
      this.mode = "List";
    }
    else{
      this.mode = "Map";
    }
    setTimeout(() => {
      this.addPublicCheckpointsOnMap();
    }, 1000);
    
    
  }
  addCheckpoint(ch:PublicCheckpoint){
    this.selectedCheckpoints.push(ch);
    let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: ch.latitude, lon: ch.longitude, picture: ch.pictures[0], name:ch.name, desc: ch.description}];
    this.mapComponent.addPublicCheckpoints(coords);
  }
  cancelCheckpoint(ch:PublicCheckpoint){
    const index = this.selectedCheckpoints.indexOf(ch);
    if (index !== -1) {
      this.selectedCheckpoints.splice(index, 1);
    }
  }
  addPublicCheckpointsOnMap(): void{
    if(this.selectedCheckpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.selectedCheckpoints[0].latitude, lon: this.selectedCheckpoints[0].longitude, picture: this.selectedCheckpoints[0].pictures[0], name: this.selectedCheckpoints[0].name, desc: this.selectedCheckpoints[0].description}];
      this.selectedCheckpoints.forEach(e => {
          if(e != this.selectedCheckpoints[0])
            // if((e.latitude > (this.selectedCheckpoints[0].latitude - 2) && (e.latitude < this.selectedCheckpoints[0].latitude + 2))
            // && ((e.longitude > this.selectedCheckpoints[0].longitude - 2) && (e.longitude < this.selectedCheckpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.mapComponent.addPublicCheckpoints(coords);
    }
  }
  loadPublicCheckpoints(){
    var location = this.mapService.search(this.selectedDestination).subscribe({
      next: (location) => {
        if(!location){
          alert('Location does not exist.');
          return;
        }
        if (location[0].lon === undefined || location[0].lat===undefined) {
          alert('Location does not exist');
          return;
        }
        else {
          this.tourAuthoringService.getPublicCheckpointsAtPlace(location[0].lon, location[0].lat).subscribe({
            next: (checkpoints)=>{
              if(checkpoints && checkpoints.totalCount>0){
                this.publicCheckpoints = checkpoints.results;
              }
              else{
                alert('There is nothing to see at this place. :(');
              }
            }
          });
        }
      },
      error: (error) => {
        console.error('Error in finding location for name:', error);
      }
    });
  }
}
