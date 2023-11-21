import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, NgModel, NgForm } from '@angular/forms';
import { Checkpoint } from '../model/checkpoint.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { Tour } from '../model/tour.model';
import { DecimalPipe, Time } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenStorage } from 'src/app/infrastructure/auth/jwt/token.service';
import { PublicCheckpoint } from '../../tour-execution/model/public_checkpoint.model';


@Component({
  selector: 'xp-checkpoint-form',
  templateUrl: './checkpoint-form.component.html',
  styleUrls: ['./checkpoint-form.component.css']
})
export class CheckpointFormComponent implements OnChanges, OnInit{

  @ViewChild(MapComponent) mapComponent: MapComponent;
  @Output() checkpointUpdated = new EventEmitter<null>();
  @Input() selectedCheckpoint: Checkpoint;
  @Input() shouldEdit: boolean = false;
  @Input() tourID: number = 0;
  picture: string = '';
  pictures: string[] = [];
  longitude: number = 0;
  latitude: number = 0;
  publicCheckpoints: PublicCheckpoint[] = [];

  constructor(private service: TourAuthoringService, private router:Router,
    private tokenStorage: TokenStorage) {
    this.checkpointForm.controls.latitude.disable();
    this.checkpointForm.controls.longitude.disable();
  }

  ngOnInit(): void {
    this.service.getCheckpoint(this.selectedCheckpoint.id || 0).subscribe(result =>{
      this.selectedCheckpoint = result;
    });

    this.service.getPublicCheckpoints().subscribe(result => {
      this.publicCheckpoints = result.results;
      this.addPublicCheckpoinsOnMap();
    });
  }
  ngAfterViewInit(): void {
    if(this.shouldEdit) {
      this.latitude = this.selectedCheckpoint.latitude;
      this.longitude=this.selectedCheckpoint.longitude;
      this.searchByCoord(this.latitude, this.longitude);
      this.searchByAddress(this.checkpointForm.controls.address.value || '');
    }
    if(this.publicCheckpoints.length > 0)
      this.addPublicCheckpoinsOnMap();
  }

  addPublicCheckpoinsOnMap(): void{
    if(this.publicCheckpoints)
    {
      let coords: [{lat: number, lon: number, picture: string, name: string, desc: string}] = [{lat: this.publicCheckpoints[0].latitude, lon: this.publicCheckpoints[0].longitude, picture: this.publicCheckpoints[0].pictures[0], name: this.publicCheckpoints[0].name, desc: this.publicCheckpoints[0].description}];
      this.publicCheckpoints.forEach(e => {
          if(e != this.publicCheckpoints[0])
            if((e.latitude > (this.publicCheckpoints[0].latitude - 2) && (e.latitude < this.publicCheckpoints[0].latitude + 2))
            && ((e.longitude > this.publicCheckpoints[0].longitude - 2) && (e.longitude < this.publicCheckpoints[0].longitude + 2)))
            coords.push({lat:e.latitude, lon:e.longitude, picture: e.pictures[0], name: e.name, desc: e.description});
      });
      this.mapComponent.addPublicCheckpoints(coords);
    }
  }
  ngOnChanges(): void {
    this.checkpointForm.reset();
    if(this.shouldEdit) {
      this.checkpointForm.patchValue(this.selectedCheckpoint);
      this.pictures = this.selectedCheckpoint.pictures;
      this.tourID = this.selectedCheckpoint.tourId;
      this.checkpointForm.controls.hours.setValue(Math.round(this.selectedCheckpoint.requiredTimeInSeconds/3600));
      this.checkpointForm.controls.minutes.setValue(((this.selectedCheckpoint.requiredTimeInSeconds%3600)/60));
    }
  }

  checkpointForm = new FormGroup({
    tourID: new FormControl(this.tourID, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    address: new FormControl(''),
    hours: new FormControl(0),
    minutes: new FormControl(0),
    status: new FormControl('Private', [Validators.required]),
    publicCP: new FormControl('')
  });
  pictureForm = new FormGroup({
    picture: new FormControl(this.picture, [Validators.required])
  });


  addCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      longitude: this.longitude || 0,
      latitude: this.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
      requiredTimeInSeconds: (this.checkpointForm.value.hours || 0)* 3600 + (this.checkpointForm.value.minutes || 0)*60,
      currentPicture:0,
      visibleSecret:false,
      showedPicture:"",
      viewSecretMessage:"",
      currentPointPicture:0,
      showedPointPicture:"",
      authorId: this.service.user.id

    };

    const status = this.checkpointForm.value.status || 'Private'

    if(this.validate(checkpoint.name, checkpoint.pictures))
    {
      this.service.addCheckpoint(checkpoint,status).subscribe({
        next: (result:any) => { this.checkpointUpdated.emit();
          this.router.navigate([`checkpoint-secret/${result.id}`]);
        }
      });
    }
  }

  updateCheckpoint(): void {
    const checkpoint: Checkpoint = {
      tourId: this.tourID,
      longitude: this.longitude || 0,
      latitude: this.latitude || 0,
      name: this.checkpointForm.value.name || "",
      description: this.checkpointForm.value.description || "",
      pictures: this.pictures || "",
      requiredTimeInSeconds: (this.checkpointForm.value.hours || 0)* 3600 + (this.checkpointForm.value.minutes || 0)*60,
      checkpointSecret: this.selectedCheckpoint.checkpointSecret,
      currentPicture:0,
      visibleSecret:false,
      showedPicture:"",
      viewSecretMessage:"",
      currentPointPicture:0,
      showedPointPicture:"",
      authorId: this.selectedCheckpoint.authorId
    };
    checkpoint.id = this.selectedCheckpoint.id;
    if(this.validate(checkpoint.name, checkpoint.pictures))
    {
      this.service.updateCheckpoint(checkpoint).subscribe({
        next: (result:any) => { this.checkpointUpdated.emit();
          this.router.navigate([`checkpoint-secret/${result.id}`]);
        }
      });
    }
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
        console.log('Found Location Lat:', foundLocation.lat);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);
        this.latitude = foundLocation.lat;
        this.longitude = foundLocation.lon;
        this.checkpointForm.controls.latitude.setValue(foundLocation.lat);
        this.checkpointForm.controls.longitude.setValue(foundLocation.lon);
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
        console.log('Found Location Lat:', foundLocation.lat);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);
        this.latitude = foundLocation.lat;
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

  onBack(): void{
    location.reload();
  }

  validate(name: string, pics: string[]): boolean{
    return name!='' && pics.length>0;
  }

  onPublicCPChange($event: any): void{

    var pc = this.publicCheckpoints.filter(n => n.id?.toString() == this.checkpointForm.controls.publicCP.value)[0];
    this.checkpointForm.reset();
    this.checkpointForm.controls.description.setValue(pc.description);
    this.checkpointForm.controls.name.setValue(pc.name);
    this.checkpointForm.controls.latitude.setValue(pc.latitude);
    this.checkpointForm.controls.longitude.setValue(pc.longitude);
    this.checkpointForm.controls.status.setValue('Private');
    this.pictures = pc.pictures;
    this.onMapClick({lat: pc.latitude, lon: pc.longitude});
  }
}
