import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { MapService } from 'src/app/shared/map/map.service';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Tour } from '../model/tour.model';
import { Router } from '@angular/router';

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
  tours: Tour[] = [
    { 
      id: 1, 
      authorId: 2, 
      name: "Brutal experience", 
      demandignessLevel: "Easy", 
      tags: ["genius", "beautiful"], 
      description: "Beautiful walk alongside the river which turns into a great adventure at midnight. Let's have fun", 
      price: 120, 
      status: "Published", 
      tourRatings: [
        { id: 1, tourId: 1, tourDate: new Date(), touristId: 3, rating: 5, creationDate: new Date() }, 
        { id: 2, tourId: 1, tourDate: new Date(), touristId: 3, rating: 4, creationDate: new Date() }
      ], 
      tourTimes: [], 
      equipment: [], 
      checkpoints: [{tourId:1, authorId:2, longitude:12.0, latitude:13.9, name:'cd', description: 'yy', pictures:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCC5RVYslWxQeeNZCsKTbV0Slq4rYZ4E96kw&usqp=CAU'], requiredTimeInSeconds:1200, currentPicture:0, currentPointPicture: 0, viewSecretMessage:'mmm', visibleSecret:true, showedPicture:'', showedPointPicture:''}]
    },
    { 
      id: 2, 
      authorId: 2, 
      name: "Mountain Expedition", 
      demandignessLevel: "Moderate", 
      tags: ["adventure", "scenic"], 
      description: "Explore the breathtaking landscapes of the mountains. A moderate-level expedition for adventure enthusiasts.", 
      price: 150, 
      status: "Published", 
      tourRatings: [
        { id: 1, tourId: 2, tourDate: new Date(), touristId: 3, rating: 2, creationDate: new Date() }, 
        { id: 2, tourId: 2, tourDate: new Date(), touristId: 3, rating: 4, creationDate: new Date() }
      ], 
      tourTimes: [], 
      equipment: [], 
      checkpoints: [{tourId:1, authorId:2, longitude:12.0, latitude:13.9, name:'cd', description: 'yy', pictures:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR94u0EyhIYQ35WVzV0LSlxZ0Ozv9tMqfzewA&usqp=CAU'], requiredTimeInSeconds:1200, currentPicture:0, currentPointPicture: 0, viewSecretMessage:'mmm', visibleSecret:true, showedPicture:'', showedPointPicture:''}]
    },
    { 
      id: 3, 
      authorId: 2, 
      name: "City Bike Tour", 
      demandignessLevel: "Easy", 
      tags: ["urban", "cycling"], 
      description: "Discover the city on a bike. An easy and enjoyable tour through urban landscapes and iconic landmarks.", 
      price: 80, 
      status: "Published", 
      tourRatings: [
        { id: 1, tourId: 3, tourDate: new Date(), touristId: 3, rating: 5, creationDate: new Date() }, 
        { id: 2, tourId: 3, tourDate: new Date(), touristId: 3, rating: 2, creationDate: new Date() }
      ], 
      tourTimes: [], 
      equipment: [], 
      checkpoints: [{tourId:1, authorId:2, longitude:12.0, latitude:13.9, name:'cd', description: 'yy', pictures:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ904w-SqHNLprXg4hU5fPoBHMjpWl5dpg0Zg&usqp=CAU'], requiredTimeInSeconds:1200, currentPicture:0, currentPointPicture: 0, viewSecretMessage:'mmm', visibleSecret:true, showedPicture:'', showedPointPicture:''}]
    },
    { 
      id: 4, 
      authorId: 2, 
      name: "Jungle Adventure", 
      demandignessLevel: "Challenging", 
      tags: ["wildlife", "jungle"], 
      description: "Embark on a challenging journey through dense jungles. Experience the thrill of wildlife and nature.", 
      price: 200, 
      status: "Published", 
      tourRatings: [], 
      tourTimes: [], 
      equipment: [], 
      checkpoints: [{tourId:1, authorId:2, longitude:12.0, latitude:13.9, name:'cd', description: 'yy', pictures:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG3PlQB2yqO1_AmQSR8bgcczzjpOLQ8cy2A&usqp=CAU'], requiredTimeInSeconds:1200, currentPicture:0, currentPointPicture: 0, viewSecretMessage:'mmm', visibleSecret:true, showedPicture:'', showedPointPicture:''}]
    },
    { 
      id: 5, 
      authorId: 2, 
      name: "Historical Walking Tour", 
      demandignessLevel: "Easy", 
      tags: ["history", "culture"], 
      description: "Take a stroll through historical sites and learn about the rich cultural heritage of the city.", 
      price: 100, 
      status: "Published", 
      tourRatings: [], 
      tourTimes: [], 
      equipment: [], 
      checkpoints: [{tourId:1, authorId:2, longitude:12.0, latitude:13.9, name:'cd', description: 'yy', pictures:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQoQuVACa7v79DCJeGHbGh5D_RfSxcJiXCtA&usqp=CAU'], requiredTimeInSeconds:1200, currentPicture:0, currentPointPicture: 0, viewSecretMessage:'mmm', visibleSecret:true, showedPicture:'', showedPointPicture:''}]
    }]
  
  constructor(private mapService: MapService, private tourAuthoringService: TourAuthoringService, private router: Router){

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




  selectTour(tour:Tour){
      if(tour.id){
        this.router.navigate(['/tour-overview-details', tour.id]);
      }
    }
  averageGrade(tour: Tour){
    var sum = 0;
    var count = 0;
    for(let g of tour.tourRatings){
      sum += g.rating;
      count ++;
    }
    return parseFloat((sum/count).toFixed(1)).toFixed(1);
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
