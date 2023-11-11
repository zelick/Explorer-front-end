import { Component, EventEmitter, Input, OnChanges, Output, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapObject } from '../model/map-object.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';

@Component({
  selector: 'xp-map-object-form',
  templateUrl: './map-object-form.component.html',
  styleUrls: ['./map-object-form.component.css'],
})
export class MapObjectFormComponent implements OnChanges {
  @Output() mapObjectUpdated = new EventEmitter<void>();
  @Input() selectedMapObject: MapObject;
  @Input() shouldEdit: boolean = false;
  @ViewChild(MapComponent) mapComponent: MapComponent;

  mapObjectForm = new FormGroup({
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    pictureURL: new FormControl('', [Validators.required]),
    status: new FormControl('Private', [Validators.required]),
  });

  constructor(private service: TourAuthoringService,
    private tokenStorage: TokenStorage,) {}

  onMapClick(event: { lat: number; lon: number }) {
    this.searchByCoord(event.lat, event.lon);
    this.mapObjectForm.patchValue({
      longitude: event.lon,
      latitude: event.lat,
    });
  }

  private searchByCoord(lat: number, lon: number) {
    this.mapComponent.reverseSearch(lat, lon).subscribe({
      next: (location) => {
        const foundLocation = location;
        console.log('Found Location Lat:', foundLocation.lon);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);

      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
  

  ngOnChanges(): void {
    this.mapObjectForm.reset();
    if (this.shouldEdit) {
      this.mapObjectForm.patchValue(this.selectedMapObject);
    }
  }

  addMapObject(): void {
    const mapObject: MapObject = {
      longitude: this.mapObjectForm.value.longitude || 0,
      latitude: this.mapObjectForm.value.latitude || 0,
      name: this.mapObjectForm.value.name || '',
      category: this.mapObjectForm.value.category || '',
      description: this.mapObjectForm.value.description || '',
      pictureURL: this.mapObjectForm.value.pictureURL || '',
    };

    const jwtHelperService = new JwtHelperService();
    const accessToken = this.tokenStorage.getAccessToken() || "";
    const status = this.mapObjectForm.value.status || 'Private'

    this.service.addMapObject(mapObject, jwtHelperService.decodeToken(accessToken).id ,status).subscribe({
      next: () => {
        this.mapObjectUpdated.emit();
      },
    });
  }

  updateMapObject(): void {
    const mapObject: MapObject = {
      longitude: this.mapObjectForm.value.longitude || 0,
      latitude: this.mapObjectForm.value.latitude || 0,
      name: this.mapObjectForm.value.name || '',
      category: this.mapObjectForm.value.category || '',
      description: this.mapObjectForm.value.description || '',
      pictureURL: this.mapObjectForm.value.pictureURL || '',
    };

    mapObject.id = this.selectedMapObject.id;
    this.service.updateMapObject(mapObject).subscribe({
      next: () => {
        this.mapObjectUpdated.emit();
      },
    });
  }
}
