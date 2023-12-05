import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourBundle } from '../model/tour-bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-tour-bundle-edit',
  templateUrl: './tour-bundle-edit.component.html',
  styleUrls: ['./tour-bundle-edit.component.css']
})
export class TourBundleEditComponent implements OnInit{
  id: number;
  tourBundle: TourBundle;
  user: User;
  toursAuthor: Tour[] = [];
  additionalTours: Tour[] = [];
  showAdditionalTours: boolean = false;

  constructor(private service: TourAuthoringService,private authService: AuthService,private router:Router, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.id = +this.route.snapshot.params['id'];
    this.getTourBundle();
  }

  getToursForAuthor(): void{
    this.service.getTour().subscribe({
      next: (result: Tour[]) => {
        this.toursAuthor = result;
        console.log("Ture za autora");
        console.log(this.toursAuthor);
        this.getAdditionalTours();
      },
      error: () => {
      }
    })
  }

  getAdditionalTours(): void {
    const additionalTours = this.toursAuthor.filter((tour) => {
      return !this.tourBundle.tours.some((bundleTour) => bundleTour.id === tour.id);
    });
    this.additionalTours = additionalTours;
    console.log("Ture za dodavanje:");
    console.log(this.additionalTours);
  }

  getTourBundle(): void{
    this.service.getBundleById(this.id).subscribe({
      next: (result: TourBundle) => {
        this.tourBundle = result;
        console.log('Paket: ');
        console.log(this.tourBundle);
        this.getToursForAuthor();
      },
      error: () => {
      }
    })
  }

  editBundle(): void{
    const editedBundle: TourBundle = {
      id: this.tourBundle.id,
      name: this.tourBundle.name,
      authorId : this.tourBundle.authorId,
      price: this.tourBundle.price, 
      status: this.tourBundle.status, 
      tours: this.tourBundle.tours
    };

    this.service.updateBundle(editedBundle).subscribe({
      next: (result: TourBundle) => {
        this.router.navigate(['/tour-bundles/' + this.user.id]);
      },
      error: () => {

      }
    })
  }

  removeTourFromBundle(tour: Tour): void{
    this.service.removeTourFromBundle(this.id, tour.id || 0).subscribe({
      next: (result: TourBundle) => {
        //this.tourBundle = result;
        this.getTourBundle();
      },
      error: () => {

      }
    })
  }

  addMoreTours(): void{
    this.showAdditionalTours = true;
  }

  addTourToBundle(tour: Tour): void{
    this.service.addTourToBundle(this.id, tour.id || 0).subscribe({
      next: (result: TourBundle) => {
        //this.tourBundle = result;
        this.getTourBundle();
      },
      error: () => {

      }
    })
  }
}
