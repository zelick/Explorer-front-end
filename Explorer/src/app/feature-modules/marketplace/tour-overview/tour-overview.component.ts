import { Component,OnInit } from '@angular/core';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MarketplaceService } from '../marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../model/tour-preview';

@Component({
  selector: 'xp-tour-overview',
  templateUrl: './tour-overview.component.html',
  styleUrls: ['./tour-overview.component.css']
})
export class TourOverviewComponent implements OnInit{

  constructor(private service: MarketplaceService,private router:Router) { }
  publishedTours:TourPreview[]=[];
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";

  ngOnInit(): void {
    this.service.getPublishedTours().subscribe(
      (response:any)=>{
        this.publishedTours=response;
      }
    )
  }

  openDetails(tour:TourPreview):void{
    this.router.navigate([`tour-overview-details/${tour.id}`]);
  }

}
