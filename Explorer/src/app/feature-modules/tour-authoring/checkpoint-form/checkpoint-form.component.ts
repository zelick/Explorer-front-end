import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel, NgForm } from '@angular/forms';
import { Checkpoint } from '../model/checkpoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';


@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges{

  @ViewChild(MapComponent) mapComponent: MapComponent;
  @Output() checkpointUpdated = new EventEmitter<null>();
  @Input() selectedCheckpoint: Checkpoint;
  @Input() shouldEdit: boolean = false;
  @Input() tourID: number = 0;
  picture: string = '';
  pictures: string[] = [];
  longitude: number = 0;
  latitude: number = 0;

  constructor(private service: TourAuthoringService) {
    this.checkpointForm.controls.latitude.disable();
    this.checkpointForm.controls.longitude.disable();
  }

  ngOnChanges(): void {
    this.checkpointForm.reset();
    if(this.shouldEdit) {
      this.checkpointForm.patchValue(this.selectedCheckpoint);
      this.pictures = this.selectedCheckpoint.pictures;
      this.tourID = this.selectedCheckpoint.tourId;
    }
  }

  checkpointForm = new FormGroup({
    tourID: new FormControl(this.tourID, [Validators.required]),
    orderNumber: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    address: new FormControl('')
  });
  pictureForm = new FormGroup({
    picture: new FormControl(this.picture, [Validators.required])
  });

  addCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.longitude || 0,
      latitude: this.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
    };
    this.service.addCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit() }
    });
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      orderNumber: this.checkpointForm.value.orderNumber || 0,
      longitude: this.longitude || 0,
      latitude: this.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
    };
    checkpoint.id = this.selectedCheckpoint.id;
    this.service.updateCheckpoint(checkpoint).subscribe({
      next: () => { this.checkpointUpdated.emit();}
    });
  }

  addPicture(): void{
    this.picture = this.pictureForm.value.picture || '';
    if(this.picture != '')
      this.pictures.push(this.picture);
    this.pictureForm.reset();
  }

  deletePicture(i: number): void{
    this.pictures.splice(i, 1);
  }

  private searchByAddress(inputAddress: string) {
    this.mapComponent.search(inputAddress).subscribe({
      next: (location) => {
        // Handle the location data here 
        // eg. send it to back-end
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

  // GEOCODING
  // When taking in an address from map
  // eg. user puts a marker on the map
  onMapClick(event: { lat: number; lon: number }) {
    this.searchByCoord(event.lat, event.lon);
  }

  onAddAddressClick()
  {
    let address = this.checkpointForm.controls.address.value || '';
    if(address != '')
      this.searchByAddress(address);
  }

  private searchByCoord(lat: number, lon: number) {
    this.mapComponent.reverseSearch(lat, lon).subscribe({
      next: (location) => {
        // Handle the location data here
        const foundLocation = location;
        console.log('Found Location Lat:', foundLocation.lon);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);
        this.latitude = foundLocation.lon;
        this.longitude = foundLocation.lon;
        this.checkpointForm.controls.latitude.setValue(this.latitude);
        this.checkpointForm.controls.longitude.setValue(this.longitude);
        this.checkpointForm.controls.address.setValue(foundLocation.display_name);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
}
