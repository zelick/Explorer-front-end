import { Component, OnInit, Input} from '@angular/core';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { LocationResponse } from 'src/app/shared/model/location-response';
import { LayoutService } from '../layout.service';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Observable, catchError, forkJoin, map, throwError } from 'rxjs';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  foundTours: TourPreview[];
  searchLocation: string = "";
  locationResponse : LocationResponse; 
  allTours: TourPreview[];
  searchButtonClicked: boolean = false;
  i:number=0;

  constructor(private layoutService : LayoutService, private marketPlaceService : MarketplaceService) { }
  
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

    //console.log('NADJENE TURE:' + JSON.stringify(this.foundTours));
  });
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
}