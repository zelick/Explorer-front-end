import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdministrationService } from '../../administration/administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PrivateTour } from '../model/private-tour.model';
import { PublicCheckpoint } from "src/app/feature-modules/tour-execution/model/public_checkpoint.model";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'xp-private-tours',
  templateUrl: './private-tours.component.html',
  styleUrls: ['./private-tours.component.css'],
  animations: [
    trigger('fade', [
      state('0', style({ opacity: 1 })),
      state('1', style({ opacity: 0 })),
      transition('0 <=> 1', animate('500ms ease-in-out'))
    ])
  ]
})

export class PrivateToursComponent implements OnInit, OnDestroy {
  touristId: number = 0;
  privateTours: PrivateTour[] = [];
  currentCheckpointIndex: number = 0;
  currentPictureIndex: number = 0;
  pictureInterval: any;
  readonly PICTURE_COUNT = 2;
  readonly CHECKPOINT_COUNT = 3;

  constructor(private service: AdministrationService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.touristId = user?.id || 0;

      const checkpoints: PublicCheckpoint[] = [
        { id: 1, longitude: -74.0059, latitude: 40.7128, name: 'Times Square', description: 'The iconic Times Square in New York City.', pictures: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL0_GjWigLIkuGOZNPa01FXSgajflYXYu-FA&usqp=CAU', 'https://i.pinimg.com/236x/9c/68/49/9c68490db6fecfdd77bd2bbc79080b3b.jpg'] },
        { id: 2, longitude: 2.3522, latitude: 48.8566, name: 'Eiffel Tower', description: 'A symbol of Paris and one of the most recognizable structures in the world.', pictures: ['https://i.pinimg.com/236x/79/7c/5f/797c5f6e031fb7fad716a5c3b507615d.jpg', 'https://i.pinimg.com/236x/fb/59/1a/fb591ae434405a2e3c1e512e8397f456.jpg'] },
        { id: 3, longitude: 139.6917, latitude: 35.6895, name: 'Tokyo Tower', description: 'An iconic landmark in Tokyo, Japan.', pictures: ['https://i.pinimg.com/236x/99/a5/f2/99a5f20fdee57e12010f055840eda500.jpg', 'https://i.pinimg.com/236x/c0/19/23/c019235b9d62329da9de99dc37400df6.jpg'] },
        { id: 4, longitude: -0.1280, latitude: 51.5074, name: 'Big Ben', description: 'A famous clock tower in London, UK.', pictures: ['https://i.pinimg.com/236x/a6/f6/99/a6f699f86e10a0629ec2b487c194db8e.jpg', 'https://i.pinimg.com/236x/90/0f/1e/900f1e34ae3d999389833703ea0a4422.jpg'] },
        { id: 5, longitude: -43.2075, latitude: -22.9083, name: 'Christ the Redeemer', description: 'A large statue of Jesus Christ in Rio de Janeiro, Brazil.', pictures: ['https://i.pinimg.com/236x/9f/84/d5/9f84d5b84d44c8512b53be8488a5098e.jpg', 'https://i.pinimg.com/236x/70/be/05/70be05a539aa54e32d0f5818567d3c59.jpg'] },
        { id: 6, longitude: -87.6298, latitude: 41.8781, name: 'Willis Tower Skydeck', description: 'A popular observation deck in Chicago, USA.', pictures: ['https://i.pinimg.com/236x/7e/4e/13/7e4e1327c5904c1f4d95da7901d4f934.jpg', 'https://i.pinimg.com/236x/e1/0d/ac/e10dacecdddfb1870af32a10912402fd.jpg'] },
        { id: 7, longitude: 12.4924, latitude: 41.8902, name: 'Colosseum', description: 'An ancient amphitheater in Rome, Italy.', pictures: ['https://i.pinimg.com/236x/5c/62/7b/5c627b4d6ed86f6ade1a98c15e2c3db4.jpg', 'https://i.pinimg.com/236x/39/71/f1/3971f1413b72ffcad015abc5ea614018.jpg'] },
      ];

      this.privateTours = [
        {
          id: 1,
          touristId: this.touristId,
          checkPoints: [checkpoints[0], checkpoints[1], checkpoints[2]],
          name: 'Global Landmarks Exploration'
        },
        {
          id: 2,
          touristId: this.touristId,
          checkPoints: [checkpoints[3], checkpoints[4], checkpoints[5]],
          name: 'European Adventure'
        },
        {
          id: 3,
          touristId: this.touristId,
          checkPoints: [checkpoints[6], checkpoints[1], checkpoints[4]],
          name: 'Historical Wonders Tour'
        }
      ];
      this.startPictureRotation();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.pictureInterval);
}

startPictureRotation(): void {
  this.pictureInterval = setInterval(() => {
    this.currentPictureIndex = (this.currentPictureIndex + 1) % this.PICTURE_COUNT;

    if (this.currentPictureIndex === 0) {
      this.currentCheckpointIndex = (this.currentCheckpointIndex + 1) % this.CHECKPOINT_COUNT;
    }
  }, 3000);
}
  
}
