import { Component, OnInit } from '@angular/core';
import { TourExecutionService } from '../tour-execution.service';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckpointPreview } from '../../marketplace/model/checkpoint-preview';

@Component({
  selector: 'xp-tour-recommendations',
  templateUrl: './tour-recommendations.component.html',
  styleUrls: ['./tour-recommendations.component.css']
})
export class TourRecommendationsComponent implements OnInit{
  recommendedTours: TourPreview[] = [];
  user: User;
  tourId: number;
  poruka: string = '';
  filterRating: number | null = null;

  constructor(private service: TourExecutionService,private authService: AuthService,private router:Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.route.params.subscribe(params => {
        this.tourId = +params['id']; 
        this.getRecommendedTours();
      });
    });
  }

  /*createSampleTours(): void {
    // Prva tura
    const tour1: TourPreview = {
      id: 1,
      name: 'Tour 1',
      description: 'Description 1',
      demandignessLevel: 'Medium',
      price: 100,
      tags: ['Adventure', 'Nature'],
      authorId: 1,
      equipment: [],
      checkpoint: {
        tourId: 1,
        longitude: 45.1234,
        latitude: 15.5678,
        name: 'Checkpoint 1',
        description: 'Description for Checkpoint 1',
        pictures: ['picture1.jpg', 'picture2.jpg'],
        requiredTimeInSeconds: 600
      },
      tourRating: [
        { id: 1, rating: 4, touristId: 1, tourId: 1, tourDate: new Date(), creationDate: new Date() },
        { id: 2, rating: 5, touristId: 2, tourId: 1, tourDate: new Date(), creationDate: new Date() }
      ],
      tourTime: [],
      discount: 10,
      salePrice: 90,
      isOnSale: true,
      saleExpiration: new Date(),
      isLastMinute: false
    };

    // Druga tura
    const tour2: TourPreview = {
      id: 2,
      name: 'Tour 2',
      description: 'Description 2',
      demandignessLevel: 'Easy',
      price: 80,
      tags: ['Cultural', 'History'],
      authorId: 1,
      equipment: [],
      checkpoint: {
        tourId: 1,
        longitude: 45.1234,
        latitude: 15.5678,
        name: 'Checkpoint 1',
        description: 'Description for Checkpoint 1',
        pictures: ['picture1.jpg', 'picture2.jpg'],
        requiredTimeInSeconds: 600
      },
      tourRating: [
        { id: 3, rating: 3, touristId: 1, tourId: 2, tourDate: new Date(), creationDate: new Date() },
        { id: 4, rating: 4, touristId: 2, tourId: 2, tourDate: new Date(), creationDate: new Date() }
      ],
      tourTime: [],
      discount: 5,
      salePrice: 75,
      isOnSale: true,
      saleExpiration: new Date(),
      isLastMinute: false
    };

    // Treća tura
    const tour3: TourPreview = {
      id: 3,
      name: 'Tour 3',
      description: 'Description 3',
      demandignessLevel: 'Difficult',
      price: 120,
      tags: ['Adventure', 'Nature'],
      authorId: 2,
      equipment: [],
      checkpoint: {
        tourId: 1,
        longitude: 45.1234,
        latitude: 15.5678,
        name: 'Checkpoint 1',
        description: 'Description for Checkpoint 1',
        pictures: ['picture1.jpg', 'picture2.jpg'],
        requiredTimeInSeconds: 600
      },
      tourRating: [
        { id: 5, rating: 2, touristId: 1, tourId: 3, tourDate: new Date(), creationDate: new Date() },
        { id: 6, rating: 2, touristId: 2, tourId: 3, tourDate: new Date(), creationDate: new Date() }
      ],
      tourTime: [],
      discount: 15,
      salePrice: 105,
      isOnSale: true,
      saleExpiration: new Date(),
      isLastMinute: false
    };

    this.recommendedTours = [tour1, tour2, tour3];
  }*/

  getRecommendedTours(): void {
    this.service.getRecommendedTours(this.tourId).subscribe({
      next: (result: TourPreview[]) => {
        this.recommendedTours = result;
        console.log('Predložene ture: ');
        console.log(this.recommendedTours);
      },
      error: () => {
        console.log('Greska prilikom preuzimanja predlozenih tura!');
      }
    })
    
  }

  sendToursToMail(): void{
    this.service.sendRecommendedToursToMail(this.tourId).subscribe({
      next: (result: PagedResults<TourPreview>) => {
        console.log('Uspesno poslat mejl!');
        this.poruka = 'Check your e-mail!';
      },
      error: () => {
        console.log('Greska prilikom slanja mejla!');
      }
    });
  }

  filterRecommendedTours() {
    if (this.filterRating !== null) {
      this.recommendedTours = this.recommendedTours.filter(tour => {
        return tour.tourRating.some(r => r.rating >= this.filterRating!);
      });
    }
  }

  showAll() {
    this.getRecommendedTours();
  }

}