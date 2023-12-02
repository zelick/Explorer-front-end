import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';
import { PublicTour } from '../../marketplace/model/public-tour.model';
import { PrivateTour } from '../model/private-tour.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

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
  mode: string = "List";
  selectedLatitude: number;
  selectedLongitude: number;
  i: number = 0;
  tours: PublicTour[] = [];
  privateTour: PrivateTour = {touristId:0, name:"", id: 0, checkPoints:[], execution:null};
  
  constructor(private service: AuthService,private mapService: MapService, private tourAuthoringService: TourAuthoringService, private router: Router){

  }
  updateTours(){
    this.tourAuthoringService.getToursWithPublicCheckpoints(this.selectedCheckpoints).subscribe({
      next: (result)=>{
        this.tours = result;
      }
    });
  }
  createTour(){
    this.privateTour.checkPoints = this.selectedCheckpoints;
    if(this.privateTour.name==="" || this.privateTour.touristId===0 || this.privateTour.checkPoints.length<2){
      alert('Invalid data');
      return;
    }
    this.tourAuthoringService.createPrivateTour(this.privateTour).subscribe({
      next: (result)=>{
        alert('You successfully created private tour '+ this.privateTour.name);
        this.mode = "List";
        this.publicCheckpoints = [];
        this.selectedDestination = "";
        this.selectedCheckpoints = [];
      },
      error: (error)=>{
        alert('Something went wrong try again.');
      }
    });
    
  }
  ngAfterViewInit(): void {
    if(this.selectedCheckpoints.length > 0)
    this.addPublicCheckpointsOnMap();
  }
  ngOnInit(): void {
    this.privateTour.touristId = this.service.user$.value.id;
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
    this.updateTours();
    let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: ch.latitude, lon: ch.longitude, picture: ch.pictures[0], name:ch.name, desc: ch.description}];
    this.mapComponent.addPublicCheckpoints(coords);
  } 
  cancelCheckpoint(ch:PublicCheckpoint){
    const index = this.selectedCheckpoints.indexOf(ch);
    if (index !== -1) {
      this.selectedCheckpoints.splice(index, 1);
    }
    this.updateTours();
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




  selectTour(tour:PublicTour){
      if(tour.id){
        this.router.navigate(['/tour-overview-details', tour.id]);
      }
    }
  swipeRight() {
    const cardWidth = document.querySelector('.tour-card')?.clientWidth || 0;
    const container = document.querySelector('.tour-cards-container');
  
    if (container && this.i + 3 < this.tours.length) {
      this.i++;
      container.scrollTo({
        left: container.scrollLeft + cardWidth,
        behavior: 'smooth',
      });
    }
  }
  
  swipeLeft() {
    const cardWidth = document.querySelector('.tour-card')?.clientWidth || 0;
    const container = document.querySelector('.tour-cards-container');
  
    if (container && this.i > 0) {
      this.i--;
      container.scrollTo({
        left: container.scrollLeft - cardWidth,
        behavior: 'smooth',
      });
    }
  }
}
