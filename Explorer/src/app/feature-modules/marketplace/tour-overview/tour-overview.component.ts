import { Component,OnInit, ViewChild } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../model/tour-preview';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { PublicTour } from '../model/public-tour.model';
import { MapObject } from '../../tour-authoring/model/map-object.model';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Sale } from '../model/sale.model';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css'], 
})
export class TourOverviewComponent implements OnInit, AfterViewInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  constructor(private service: MarketplaceService,private router:Router, private authService: AuthService) { }

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
  user: User;
  showOnlyOnSale: boolean = false;
  sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.service.getMapObjects().subscribe( result => {
      this.mapObjects = result.results;
      this.addMapObjectsOnMap();
    });

    this.service.getPublicCheckpoints().subscribe( result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });

    this.service.getPublishedTours().subscribe((tours: TourPreview[]) => {
      this.service.getActiveSales().subscribe((activeSales: Sale[]) => {
        this.publishedTours = this.mapDiscountedPricesToTours(tours, activeSales);
        this.searchTours = this.publishedTours;
        this.getPublicTours();
      });
    });
  }

  mapDiscountedPricesToTours(tours: TourPreview[], activeSales: Sale[]): TourPreview[] {
    return tours.map(tour => {
      const matchingSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
      const discountedPrice = this.calculateDiscountedPrice(tour, activeSales);
      const isOnSale = this.isOnSale(tour.id!, activeSales);

      return {
        ...tour,
        discount: matchingSale ? matchingSale.discount : 0,
        salePrice: discountedPrice,
        isOnSale: isOnSale
      };
    });
  }

  calculateDiscountedPrice(tour: TourPreview, activeSales: Sale[]): number {
    const activeSale = activeSales.find(sale => sale.toursIds.includes(tour.id!));
    if (activeSale) {
      const discountPercentage = activeSale.discount;
      const discountedPrice = tour.price * (1 - discountPercentage / 100);
      return discountedPrice;
    } else {
      return tour.price;
    }
  }

  isOnSale(tourId: number, activeSales: Sale[]): boolean {
    return activeSales.some(sale => sale.toursIds.includes(tourId));
  }

  filterTours() {
    if (this.showOnlyOnSale) {
      this.searchTours = this.searchTours.filter(tour => tour.isOnSale);
      this.sortToursBySale();
    } else {
      this.cancleSearch();
    }
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.filterTours();
  }

  sortToursBySale() {
    this.searchTours.sort((a, b) => {
      const discountA = a.discount;
      const discountB = b.discount;

      if (this.sortOrder === 'asc') {
        return discountA - discountB;
      } else {
        return discountB - discountA;
      }
    });
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
        this.showOnlyOnSale = false;
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
    this.searchTours = this.publishedTours;
    this.mapComponent.reloadMap();
  }
}
