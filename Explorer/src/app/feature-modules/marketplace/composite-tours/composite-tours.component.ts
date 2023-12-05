import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from 'src/app/shared/map/map.component';
import { MarketplaceService } from '../../marketplace/marketplace.service';
import { Router } from '@angular/router';
import { TourPreview } from '../../marketplace/model/tour-preview';
import { PublicTour } from '../../marketplace/model/public-tour.model';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';
import { MapObject } from '../../tour-authoring/model/map-object.model';
import { CompositePreview } from '../model/composite-preview';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompositeEquipmentPopupComponent } from '../composite-equipment-popup/composite-equipment-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CompositeKeypointPopupComponent } from '../composite-keypoint-popup/composite-keypoint-popup.component';


@Component({
  selector: 'xp-composite-tours',
  templateUrl: './composite-tours.component.html',
  styleUrls: ['./composite-tours.component.css']
})
export class CompositeToursComponent implements OnInit, AfterViewInit{
  @ViewChild(MapComponent) mapComponent: MapComponent;
  constructor(private service: MarketplaceService,private router:Router,  private authService: AuthService, public dialog:MatDialog) { }

  ngAfterViewInit(): void {

  }

  user: User;

  compositeTours: CompositePreview[];
  publishedTours:TourPreview[]=[];
  publicTours: PublicTour[] = [];
  foundTours: TourPreview[] = [];
  searchTours: TourPreview[] = [];
  selectedLongitude: number;
  selectedLatitude: number;
  radius: number = 500; // Inicijalna vrednost precnika (scroller)
  picture:string="https://conversionfanatics.com/wp-content/themes/seolounge/images/no-image/No-Image-Found-400x264.png";
  mapObjects: MapObject[] = [];
  publicCheckpoints: PublicCheckpoint[] = [];

  ngOnInit(): void {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });


    this.service.getAllCompositeTours().subscribe(
      (response:any)=>{
        this.compositeTours = response.results.filter((tour: any) => tour.ownerId === this.user.id);
        console.log(this.compositeTours);
      }
    )

  }

  showEquipment(t: CompositePreview){
    const dialogRef = this.dialog.open(CompositeEquipmentPopupComponent, {
      data: { equipmentList: t.equipment },
      width: '300px',
      height: '300px',
      panelClass: 'custom-dialog',
  });
}

  showKeyPoints(t: CompositePreview){
    const dialogRef = this.dialog.open(CompositeKeypointPopupComponent, {
      data: { checkpointList: t.checkpoints },
      width: '300px',
      height: '300px',
      panelClass: 'custom-dialog',
  });
}


}