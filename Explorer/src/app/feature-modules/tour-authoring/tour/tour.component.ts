import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourBundle } from '../model/tour-bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{
  tours: Tour[] = [];
  showBundleTours: boolean = false;
  bundleTotalPrice: number = 0;
  bundleName: string = '';
  bundlePrice: number = 0;
  bundleTours: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  user: User;
  id:number;
  
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";

  
  constructor(private service: TourAuthoringService, private authService: AuthService, private router: Router, private imageService: ImageService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getTour();
  }
  
  deleteTour(id: number): void {
    this.service.deleteTour(id).subscribe({
      next: () => {
        this.getTour();
      },
    })
  }

  getTour(): void {
    this.service.getTour().subscribe({
      next: (result: Tour[]) => {
        this.tours = result;
        console.log('Ture: ');
        console.log(this.tours);
        this.tours.forEach(element => {
          element.checkpoints = element.checkpoints || [];
        });
        console.log(this.tours);
      },
      error: () => {
      }
    })
  }

  onEditClicked(tour: Tour): void {
    this.selectedTour = tour;
    this.shouldRenderTourForm = true;
    this.shouldEdit = true;
    this.router.navigate([`tour-form/${tour.id}`]);

  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderTourForm = true;
    this.router.navigate([`tour-form/0`]);

  }
  openDetails(t:Tour): void {
    this.router.navigate([`tour-details/${t.id}`]);
  }

  addToBundle(tour: Tour): void {
    const tourExists = this.bundleTours.some(existingTour => existingTour.id === tour.id);
    if (!tourExists) {
        this.showBundleTours = true;
        this.bundleTours.push(tour);
        this.bundleTotalPrice += tour.price;
    }
  }
  
  createBundle(): void{
    const tourBundle: TourBundle = {
      name: this.bundleName,
      price: this.bundlePrice,
      authorId: this.user.id, 
      status: 'Draft',
      tours: this.bundleTours // obrisala punu listu zapamti ovde 
    };

    this.service.createTourBundle(tourBundle).subscribe({
      next: (result: TourBundle) => {
          this.router.navigate([`tour-bundles/${this.user.id}`]);

      },
      error: (error: any) => {
      }
  });
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}
