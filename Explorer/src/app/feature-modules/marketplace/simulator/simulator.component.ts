import { Component, EventEmitter, OnInit, ViewChild, Output } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { MapComponent } from 'src/app/shared/map/map.component';
import { TouristPosition } from '../model/position.model';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent: MapComponent;
  positions: TouristPosition[] = [];
  selectedPosition: TouristPosition;
  shouldEdit: boolean = false;
  user: User;
  @Output() positionUpdated: EventEmitter<null> = new EventEmitter<null>();

  constructor(private service: MarketplaceService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
    this.getPosition();
  }

  deletePosition(id: number): void {
    this.service.deleteTouristPosition(id).subscribe({
      next: () => {
        this.getPosition();
      },
    })
  }

  addTouristPosition(position: TouristPosition): void {
    this.service.addTouristPosition(position).subscribe({
      next: () => { 
        this.getPosition(); 
        this.selectedPosition = position;
        this.positionUpdated.emit();
      }
    });
  }

  getPosition(): void {
    this.service.getTouristPosition(this.user.id).subscribe({
      next: (result: TouristPosition) => {
        this.positions = [];
        if(!(result.latitude == null)){
          this.positions.push(result);
        }
        console.log(result);
        console.log(this.positions.length);
      },
      error: () => {
      }
    })
  }

  onMapClick(event: { lat: number; lon: number }) {
    this.searchByCoord(event.lat, event.lon);
  }

  addCheckpoint(coords: [{lat: number, lon: number}]): void{
    this.mapComponent.addCheckpoints(coords);
  }
  private searchByCoord(lat: number, lon: number) {
    this.mapComponent.addTouristPosition(lat, lon).subscribe({
      next: (location) => {
        const foundLocation = location;
        console.log('Found Location Lat:', foundLocation.lat);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);

        const position: TouristPosition = {
          latitude: Number(foundLocation.lat) || 0,
          longitude: Number(foundLocation.lon) || 0,
          creatorId : this.user.id,
        };

        if (this.positions.length === 0) {
          this.addTouristPosition(position);
          //this.getPosition();
        } else {
          if (this.positions[0]?.id !== undefined) {
            console.log(this.positions[0]);
            this.deletePosition(this.positions[0].id);
            console.log("delete works")
          }
          this.positions = [];
          this.addTouristPosition(position);
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
}
