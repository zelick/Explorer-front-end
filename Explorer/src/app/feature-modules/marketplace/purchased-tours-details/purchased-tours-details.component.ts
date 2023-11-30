import { Component,OnInit ,ViewChild} from '@angular/core';
import { TourPreview } from '../model/tour-preview';
import { MarketplaceService } from '../marketplace.service';
import { ActivatedRoute } from '@angular/router';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Router } from '@angular/router';
import { CheckpointPreview } from '../model/checkpoint-preview';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { PurchasedTourPreview } from '../../tour-execution/model/purchased_tour_preview.model';


@Component({
  selector: 'xp-purchased-tours-details',
  templateUrl: './purchased-tours-details.component.html',
  styleUrls: ['./purchased-tours-details.component.css']
})

export class PurchasedToursDetailsComponent implements OnInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;

  constructor(private service: MarketplaceService,private activatedRoute:ActivatedRoute,private router:Router, private authService : AuthService) { }

    ngOnInit(): void {

        this.activatedRoute.params.subscribe(params=>{
            this.tourId=params['id'];
            this.getPurchasedTour(this.tourId);
       
            this.authService.user$.subscribe(user => {
             this.user = user;
           });
        })
    }

    tour: PurchasedTourPreview;
    tourId:number;
    checkpoints:CheckpointPreview;
    profiles: string[] = ['walking', 'cycling', 'driving'];
    profile: string = this.profiles[0];
    user: User;

    getPurchasedTour(id: number): void {
        this.service.getPurchasedTourDetails(id).subscribe({
            next: (result: PurchasedTourPreview) => {
                this.tour = result;
                this.mapComponent.setCheckpoints(this.tour.checkpoints);
            },
            error: () => {
            }
        });    
    }

    tourExecution() {
        this.router.navigate([`tour-execution/` + this.tour.id || 0]);
    }

    onBack():void{
        this.router.navigate([`purchased-tours`]);
    }
}