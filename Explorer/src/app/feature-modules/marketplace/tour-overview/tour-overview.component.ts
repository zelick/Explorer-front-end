import { Component,OnInit, ViewChild } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../model/tour-preview';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PublicTour } from '../model/public-tour.model';


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
  publicTours: PublicTour[] = [];
  foundTours: TourPreview[] = [];
  searchTours: TourPreview[] = [];
  selectedLongitude: number;
  selectedLatitude: number;
  radius: number = 500; // Inicijalna vrednost precnika (scroller)
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";

  ngOnInit(): void {
    this.service.getPublishedTours().subscribe(
      (response:any)=>{
        this.publishedTours = response;
        this.searchTours = response;
        this.getPublicTours();
      }
    )
  }

  getPublicTours():void{
    this.service.getPublicTours().subscribe(
      (response:any)=>{
        this.publicTours = response;
      }
    )
  }

  openDetails(tour:TourPreview):void{
    this.router.navigate([`tour-overview-details/${tour.id}`]);
  }

  onMapClick(event: { lat: number; lon: number }) {
    this.selectedLatitude = event.lat;
    this.selectedLongitude = event.lon;
    this.updateRadius();
  }

  updateRadius() {
    this.drawCircle();
    this.findNearTours();
  }

  findNearTours(): void{
    const promises = this.publicTours.map(tour => {
      return this.checkDistance(tour);
    });

    Promise.all(promises).then(() => {
      if (this.foundTours.length > 0) {
        this.searchTours = [];
        this.searchTours = this.foundTours;
      }
    });
  }

  checkDistance(tour: PublicTour): Promise<void> {
    console.log(tour);
    const originCoords: { lat: number; lon: number } = {
      lat: this.selectedLatitude,
      lon: this.selectedLongitude
    };
  
    let found = false;
  
    const promises = tour.previewCheckpoints.map(checkpoint => {
      const destinationCoords: { lat: number; lon: number } = {
        lat: checkpoint.latitude,
        lon: checkpoint.longitude
      };
  
      return this.mapComponent.calculateDistance([originCoords, destinationCoords], 'walking')
        .then(distanceBetween => {
          console.log(distanceBetween);
          if (distanceBetween <= this.radius && !found) {
            const existingTour = this.findTourById(tour.id || 0);
  
            if (existingTour && !this.foundTours.some(t => t.id === existingTour.id)) {
              this.foundTours.push(existingTour);
            }
            this.drowTour(tour);
            found = true;
          }
        })
        .catch(error => {
          console.error('Greška pri izračunavanju rute:', error);
          throw error;
        });
    });
  
    return Promise.all(promises)
      .then(() => {
      })
      .catch(error => {
        console.error('Error in Promise.all:', error);
      });
  }
  


  findTourById(id: number): TourPreview | undefined{
    return this.publishedTours.find(t => t.id === id);
  }

  drowTour(tour: PublicTour): void{
    let coords: [{lat: number, lon: number}] = [{lat: tour.previewCheckpoints[0].latitude, lon: tour.previewCheckpoints[0].longitude}];
    tour.previewCheckpoints.forEach(e => {
        if(e != tour.previewCheckpoints[0])
          coords.push({lat:e.latitude, lon:e.longitude});
    });
    this.mapComponent.setRoute(coords, 'walking'); //proveriti za profil, izmena?
  }
  
  drawCircle(): void {
    console.log(this.radius);
    this.mapComponent.setCircle(
      { lat: this.selectedLatitude, lon: this.selectedLongitude },
      this.radius
    );
  }

  cancleSearch():void {
    this.service.getPublishedTours().subscribe(
      (response:any)=>{
        this.searchTours = response;
      }
    )
    this.mapComponent.reloadMap();
  }
}
