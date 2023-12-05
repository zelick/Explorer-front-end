import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TourBundle } from '../model/tour-bundle.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tour-bundles',
  templateUrl: './tour-bundles.component.html',
  styleUrls: ['./tour-bundles.component.css']
})
export class TourBundlesComponent implements OnInit{
  tourBundles: TourBundle[] = [];
  user: User;

  constructor(private service: TourAuthoringService,private authService: AuthService,private router:Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getTourBundles();
  }

  getTourBundles(): void{
    this.service.getBundlesByAuthor(this.user.id).subscribe({
      next: (result: TourBundle[]) => {
        this.tourBundles = result;
        console.log('Svi paketi: ');
        console.log(this.tourBundles);
      },
      error: () => {
      }
    })
  }

  deleteBundle(id: number): void{
    this.service.deleteBundle(id).subscribe({
      next: (result: TourBundle) => {
        this.getTourBundles();
      },
      error: () => {

      }
    })
  }

  archiveBundle(bundle: TourBundle): void{
    bundle.status = "Archived";
    this.service.updateBundle(bundle).subscribe({
      next: (result: TourBundle) => {
        this.getTourBundles();
      },
      error: () => {

      }
    })
  }

  publishBundle(bundle: TourBundle): void{
    bundle.status = "Published";
    this.service.updateBundle(bundle).subscribe({
      next: (result: TourBundle) => {
        this.getTourBundles();
      },
      error: () => {

      }
    })
  }

  canPublish(bundle: TourBundle): boolean {
    const publishedTours = bundle.tours.filter(tour => tour.status === 'Published');
    const canPublishResult = publishedTours.length >= 2;
    return canPublishResult;
  }

  editBundle(bundle: TourBundle): void{
    this.router.navigate(['/tour-bundle-edit/' + bundle.id || '']);
  }
}
