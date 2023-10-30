import { Component, OnInit } from '@angular/core';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit{
  tours: Tour[] = [];
  selectedTour: Tour;
  shouldRenderTourForm: boolean = false;
  shouldEdit: boolean = false;
  user: User;
  id:number;

  
  constructor(private service: TourAuthoringService,private authService: AuthService,private router:Router) { }

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
    this.service.getTour(this.user.id).subscribe({
      next: (result: Tour[]) => {
        this.tours = result;
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
    this.router.navigate([`tour-form/-1`]);

  }
  openDetails(t:Tour): void {
    this.router.navigate([`tour-details/${t.id}`]);
  }
  publishTour(tour: Tour): void{
    this.service.publishTour(tour.id || 0).subscribe({
    });
  }
}
