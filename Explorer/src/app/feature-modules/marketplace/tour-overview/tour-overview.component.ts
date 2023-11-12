import { Component,OnInit, ViewChild } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../model/tour-preview';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css'], 
})
export class TourOverviewComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  constructor(private service: MarketplaceService,private router:Router) { }
  publishedTours:TourPreview[]=[];
   //search:
  tours: Tour[] = [];
  foundTours: Tour[] = [];
  selectedLongitude: number;
  selectedLatitude: number;
  radius: number = 500; // Inicijalna vrednost precnika (scroller)
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";

  ngOnInit(): void {
    this.service.getPublishedTours().subscribe(
      (response:any)=>{
        this.publishedTours=response;
        this.getTours();
      }
    )
  }

 getTours():void{
    this.service.getTours().subscribe({
      next: (result: PagedResults<Tour>) => {
        this.tours = result.results;
        console.log(this.tours);
      },
    });
  }

  openDetails(tour:TourPreview):void{
    this.router.navigate([`tour-overview-details/${tour.id}`]);
  }

  onMapClick(event: { lat: number; lon: number }) {
    //this.mapComponent.clearMap();
    this.selectedLatitude = event.lat;
    this.selectedLongitude = event.lon;
    this.updateRadius();
  }

  updateRadius() {
    this.drawCircle();
    this.findNearTours();
  }

  findNearTours(): void{
   // this.foundTours = []; //izbaci sve prethodne
    this.tours.forEach(tour => {
      this.checkDistance(tour);
    });
  }

  checkDistance(tour: Tour): void {
    const originCoords: { lat: number; lon: number } = {
      lat: this.selectedLatitude,
      lon: this.selectedLongitude
    };

    let found = false;
  
    for (const checkpoint of tour.checkpoints) {
      console.log(checkpoint);
      const destinationCoords: { lat: number; lon: number } = {
        lat: checkpoint.latitude,
        lon: checkpoint.longitude
      };
  
      this.mapComponent.calculateDistance([originCoords, destinationCoords], 'walking')
        .then((distanceBetween) => {
          console.log(distanceBetween);
          if (distanceBetween <= this.radius && !found) {
            console.log('usao u if');
            this.foundTours.push(tour);
            this.drowTour(tour);
            found = true;  // Postavi found na true da se izbegne dodavanje iste ture više puta
          }
        })
        .catch((error) => {
          console.error('Greška pri izračunavanju rute:', error);
        });
    }
  }
  drowTour(tour: Tour): void{
    let coords: [{lat: number, lon: number}] = [{lat: tour.checkpoints[0].latitude, lon: tour.checkpoints[0].longitude}];
    tour.checkpoints.forEach(e => {
        if(e != tour.checkpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    this.mapComponent.setRoute(coords, 'walking'); //proveriti za profil
  }
  
  drawCircle(): void {
    console.log(this.radius);
    this.mapComponent.setCircle(
      { lat: this.selectedLatitude, lon: this.selectedLongitude },
      this.radius
    );
  }
}
