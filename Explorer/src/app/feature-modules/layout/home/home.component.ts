import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { LocationResponse } from 'src/app/shared/model/location-response';
import { LayoutService } from '../layout.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';
import { TourRating } from '../../marketplace/model/tour-rating.model';
import { TourLocation } from '../../marketplace/model/tour-location.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { MapService } from 'src/app/shared/map/map.service';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit{
  
  @ViewChild(MapComponent) mapComponent: MapComponent;

  foundTours: TourPreview[];
  searchLocation: string = "";
  locationResponse : LocationResponse; 
  allTours: TourPreview[];
  searchButtonClicked: boolean = false;
  i:number=0;

  constructor(private layoutService : LayoutService, private marketPlaceService : MarketplaceService, private mapService: MapService) { }
  
  ngOnInit(): void {
    this.layoutService.getAllTours().subscribe({
      next: (result: any) => {
        this.allTours = result;
        console.log(this.allTours);
      },
      error: () => {
        console.log('Nije ucitao sve ture');
      }
    });
  }

  averageGrade(tour: TourPreview){
    var sum = 0;
    var count = 0;
    for(let g of tour.tourRating){
      sum += g.rating;
      count ++;
    }
    return parseFloat((sum/count).toFixed(1)).toFixed(1);
  }

  getPlaceInfo(latitude: number, longitude: number): Observable<string> {
    return this.layoutService.getPlaceInfo(latitude, longitude)
      .pipe(
        map((data: any) => {
          if (data.display_name) {
            const name = data.display_name;
            //console.log(`Name: ${name}`);
  
            // Razdvajanje imena grada i države
            const addressParts = name.split(', ');
            const city = addressParts[3];
            const country = addressParts[addressParts.length - 1];
  
            //console.log(`City: ${city}`);
            //console.log(`Country: ${country}`);
  
            // Vraćanje samo imena
            return name;
          } else {
            console.log('Nema rezultata.');
            return ''; // Možete vratiti neki podrazumevani string ako nema rezultata
          }
        }),
        catchError(error => {
          console.error('Greška prilikom dohvatanja podataka:', error);
          return throwError('Greška prilikom dohvatanja podataka'); // Možete koristiti throwError za prosleđivanje greške
        })
      );
  }

 search(): void {
  this.searchButtonClicked = true;
  console.log(this.searchLocation);

  this.foundTours = []; // Resetovanje foundTours pre svakog pretrage
  this.scroll();

  const observables = this.allTours.map(tour =>
    this.getPlaceInfo(tour.checkpoint.latitude, tour.checkpoint.longitude)
  );

  forkJoin(observables).subscribe(names => {
    names.forEach((name, index) => {
      console.log(`Dobijeno ime: ${name}`);
  
      // Provera da li se searchLocation nalazi u imenu
      if (name.toLowerCase().includes(this.searchLocation.toLowerCase())) {
        this.foundTours.push(this.allTours[index]); // Dodavanje ture u foundTours
      }
    });

    console.log(this.foundTours);

    for (let tour of this.foundTours) {
      this.averageGrade(tour);
    }

    this.findToursLocation();

    //console.log('NADJENE TURE:' + JSON.stringify(this.foundTours));
  });
}

scroll(): void {
  const element = document.getElementsByClassName('content')[0];
  var add = window.scrollY + 700;

  if (element) {
    const rect = element.getBoundingClientRect();
    add = rect.top;
    console.log('OVO JE RECT TOP ' + rect.top);
  }

  window.scrollTo({
    top: add,
    behavior: 'smooth'
  });
}

cancelSearch(): void {
  this.searchButtonClicked = false;
  this.searchLocation = ''; // Postavljanje na prazan string
  this.foundTours = []; // Resetovanje pronađenih tura
}

swipeRight() {
  const cardWidth = document.querySelector('.tour-card')?.clientWidth || 0;
  const container = document.querySelector('.tour-cards-container');

  if (container && this.i + 3 < this.foundTours.length) {
    this.i++;
    // Use scrollTo for smooth scrolling
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
    // Use scrollTo for smooth scrolling
    container.scrollTo({
      left: container.scrollLeft - cardWidth,
      behavior: 'smooth',
    });
  }
}

toursLocation: TourLocation[] = [];

findToursLocation(): void {
  this.foundTours.forEach(tour => {
    this.mapService.reverseSearch(tour.checkpoint.latitude, tour.checkpoint.longitude).subscribe({
      next: (location) => {
        let tourLocation: TourLocation = {
          tourid: 0,
          adress: ''
        };

        if (location.address.city === undefined) {
          tourLocation = {
            tourid: tour.id || 0,
            adress: location.address.city_district + ' , ' + location.address.country 
          };
        }
        else {
          tourLocation = {
            tourid: tour.id || 0,
            adress: location.address.city + ' , ' + location.address.country 
          };
        }

        console.log(location);
        this.toursLocation.push(tourLocation);
      },
      error: (error) => {
        console.error('Error in finding location for lon and lat:', error);
      }
    });
  });
}


  getTourLocation(tourid: number): string{
    const tourLocation = this.toursLocation.find(location => location.tourid === tourid);
    console.log(tourLocation?.adress);
    return tourLocation?.adress || "";
  }

}