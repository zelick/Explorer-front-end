import { Component, EventEmitter, Input, OnChanges, Output, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapObject } from '../model/map-object.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { ImageService } from 'src/app/shared/image/image.service';

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
    category: new FormControl('Other', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    picture: new FormControl(null, [Validators.required, this.fileValidator]),
    pictureURL: new FormControl('', [Validators.required]),
    status: new FormControl('Private', [Validators.required]),
  });

  private fileValidator(control: FormControl): { [key: string]: any } | null {
    const value: File | null = control.value;
  
    if (!value) {
      return { required: true, invalidFileType: false };
    }
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    if (allowedFileTypes.indexOf(value.type) === -1) {
      return { required: false, invalidFileType: true };
    }
  
    return null;
  }

  constructor(private service: TourAuthoringService,
    private tokenStorage: TokenStorage,
    private imageService: ImageService) {}

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
      this.mapObjectForm.patchValue({
        longitude: this.selectedMapObject.longitude,
        latitude: this.selectedMapObject.latitude,
        name: this.selectedMapObject.name,
        description: this.selectedMapObject.description,
        category: this.selectedMapObject.category,
        //picture: this.imageService.getImageUrl(this.selectedMapObject.pictureURL),
        pictureURL: this.selectedMapObject.pictureURL
      });

      this.selectedImage = this.selectedMapObject.pictureURL;
    }
  }

  addMapObject(): void {
    const pictureValue = this.mapObjectForm.value.picture;

    if (this.isFile(pictureValue)){
      const mapObject: MapObject = {
        longitude: this.mapObjectForm.value.longitude || 0,
        latitude: this.mapObjectForm.value.latitude || 0,
        name: this.mapObjectForm.value.name || '',
        category: this.mapObjectForm.value.category || '',
        description: this.mapObjectForm.value.description || '',
        picture: pictureValue as File,
        pictureURL: this.mapObjectForm.value.pictureURL || '',
      };
  
      const formData = new FormData();
    
        Object.keys(mapObject).forEach(key => {
          const value = mapObject[key as keyof MapObject];
          if (value !== null && value !== undefined) {
            if (value instanceof File) {
              formData.append(key, value, value.name);
            } else {
              formData.append(key, value.toString());
            }
          }
        });
  
      const jwtHelperService = new JwtHelperService();
      const accessToken = this.tokenStorage.getAccessToken() || "";
      const status = this.mapObjectForm.value.status || 'Private'
  
      this.service.addMapObject(mapObject, jwtHelperService.decodeToken(accessToken).id ,status, formData).subscribe({
        next: () => {
          this.mapObjectUpdated.emit();
        },
      });
    }
  }

  updateMapObject(): void {
    const pictureValue = this.mapObjectForm.value.picture;

    if (this.isFile(pictureValue)){
      const mapObject: MapObject = {
        longitude: this.mapObjectForm.value.longitude || 0,
        latitude: this.mapObjectForm.value.latitude || 0,
        name: this.mapObjectForm.value.name || '',
        category: this.mapObjectForm.value.category || '',
        description: this.mapObjectForm.value.description || '',
        picture: pictureValue as File,
        pictureURL: this.mapObjectForm.value.pictureURL || '',
      };
  
      const formData = new FormData();

      Object.keys(mapObject).forEach(key => {
        const value = mapObject[key as keyof MapObject];
        if (value !== null && value !== undefined) {
          if (value instanceof File) {
            formData.append(key, value, value.name);
          } else if (typeof value === 'string') {
            formData.append(key, value);
          }
        }
      });

      mapObject.id = this.selectedMapObject.id;
      this.service.updateMapObject(mapObject, formData).subscribe({
        next: () => {
          this.mapObjectUpdated.emit();
        },
      });
    }
  }

  private isFile(value: any): value is File {
    return value instanceof File;
  }
  
  selectedImage: string | null = null;

  onProfilePictureSelected(event: any) {
    const file = event?.target?.files[0];

    if (file) {
      this.mapObjectForm.patchValue({ picture: file });

      const fileName = file.name;
      const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
      const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
      const pictureURL = `${baseName}_profile.${extension}`;
      this.mapObjectForm.patchValue({ pictureURL });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
    }
  }
}
