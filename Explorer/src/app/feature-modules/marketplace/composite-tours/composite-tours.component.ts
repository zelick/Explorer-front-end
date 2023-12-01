import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { PublicTour } from '../../marketplace/model/public-tour.model';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { MapObject } from '../../tour-authoring/model/map-object.model';

@Component({
  selector: 'xp-composite-tours',
  templateUrl: './composite-tours.component.html',
  styleUrls: ['./composite-tours.component.css']
})
export class CompositeToursComponent implements OnInit, AfterViewInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  constructor(private service: MarketplaceService,private router:Router) { }

  ngAfterViewInit(): void {
    if(this.mapObjects.length > 0)
    this.addMapObjectsOnMap();
    if(this.publicCheckpoints.length > 0)
    this.addPublicCheckpoinsOnMap();
  }
  publishedTours:TourPreview[]=[];
   //search:
  publicTours: PublicTour[] = [];
  foundTours: TourPreview[] = [];
  searchTours: TourPreview[] = [];
  selectedLongitude: number;
  selectedLatitude: number;
  radius: number = 500; // Inicijalna vrednost precnika (scroller)
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";
  mapObjects: MapObject[] = [];
  publicCheckpoints: PublicCheckpoint[] = [];

  ngOnInit(): void {
    this.service.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.service.getPublicCheckpoints().subscribe( result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });

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

  addMapObjectsOnMap(): void{
    if(this.mapObjects)
    {
      let coords: [{lat: number, lon: number, category: string, name: string, desc: string}] = [{lat: this.mapObjects[0].latitude, lon: this.mapObjects[0].longitude, category: this.mapObjects[0].category, name: this.mapObjects[0].name, desc: this.mapObjects[0].description}];
      this.mapObjects.forEach(e => {
          coords.push({lat:e.latitude, lon:e.longitude, category: e.category, name: e.name, desc: e.description});
      });
      this.mapComponent.addMapObjects(coords);
    }
  }

  addPublicCheckpoinsOnMap(): void{
    if(this.publicCheckpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.publicCheckpoints[0].latitude, lon: this.publicCheckpoints[0].longitude, picture: this.publicCheckpoints[0].pictures[0], name: this.publicCheckpoints[0].name, desc: this.publicCheckpoints[0].description}];
      this.publicCheckpoints.forEach(e => {
          if(e != this.publicCheckpoints[0])
            if((e.latitude > (this.publicCheckpoints[0].latitude - 2) && (e.latitude < this.publicCheckpoints[0].latitude + 2))
            && ((e.longitude > this.publicCheckpoints[0].longitude - 2) && (e.longitude < this.publicCheckpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.mapComponent.addPublicCheckpoints(coords);
    }
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