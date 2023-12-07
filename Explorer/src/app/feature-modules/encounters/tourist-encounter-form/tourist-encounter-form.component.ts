import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EncounterService } from '../encounter.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image/image.service';
import { FormControl, Validators,FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Checkpoint } from '../../tour-authoring/model/checkpoint.model';
import { TourAuthoringService } from '../../tour-authoring/tour-authoring.service';
import { Encounter } from '../model/encounter.model';
import { __values } from 'tslib';
import { MapComponent } from 'src/app/shared/map/map.component';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-tourist-encounter-form',
  templateUrl: './tourist-encounter-form.component.html',
  styleUrls: ['./tourist-encounter-form.component.css']
})
export class TouristEncounterFormComponent {
  constructor(private service: EncounterService, authService: AuthService, private imageService: ImageService,private activatedRoute:ActivatedRoute,
    private tourAuthoringService: TourAuthoringService,private router:Router) {
    this.authorId = authService.user$.value.id;
    this.encounterForm.controls.latitude.disable();
    this.encounterForm.controls.longitude.disable();
    this.encounterForm.controls.locationLatitude.disable();
    this.encounterForm.controls.locationLongitude.disable();
  }

  @ViewChild(MapComponent) mapComponent: MapComponent;
  authorId:number;
  id:number;
  imagePreview: string[] = [];
  encounter:Encounter;
  edit:boolean=false;
  encounterId:number;
  checkpoints: Checkpoint[] = [];
  checkpointID: number | undefined;
  longitude: number | undefined
  latitude: number | undefined


  ngOnInit(): void {
    this.getCheckpoints();
  }

  getCheckpoints(): void {
    this.tourAuthoringService.getCheckpoints().subscribe({
      next: (result: PagedResults<Checkpoint>) => {
        this.checkpoints = result.results;
      },
      error: () => {
      }
    })
  }

  encounterForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    xp:new FormControl(0,[Validators.required]),
    type:new FormControl('Misc',[Validators.required]), 
    isPrerequisite:new FormControl(false,[Validators.required]),
    longitude:new FormControl(0, [Validators.required]),
    latitude:new FormControl(0,[Validators.required]),
    range:new FormControl(0),
    requiredPeople:new FormControl(0),
    locationLongitude:new FormControl(0),
    locationLatitude:new FormControl(0),
    images:new FormControl(''),
    checkpointId: new FormControl(0,[Validators.required])
  });
  type:string=this.encounterForm.value.type||"";

  onNext():void{

    let formData=new FormData;
    this.encounterForm.value.checkpointId = this.checkpointID;
    this.encounterForm.value.longitude = this.longitude;
    this.encounterForm.value.latitude = this.latitude;
    formData.append('name', this.encounterForm.value.name||"");
    formData.append('description', this.encounterForm.value.description||"");
    formData.append('authorId', this.authorId.toString());
    formData.append('xp', this.encounterForm.value.xp?.toString()||"");
    formData.append('status', "Published");
    formData.append('longitude',this.encounterForm.value.longitude?.toString()||"");
    formData.append('latitude',this.encounterForm.value.latitude?.toString()||"" );
    formData.append('type',this.encounterForm.value.type||"" );

    if(this.encounterForm.value.type==="Social")
    {
      formData.append('range', this.encounterForm.value.range?.toString()||"");
      formData.append('requiredPeople', this.encounterForm.value.requiredPeople?.toString()||"");
    }
    if (this.encounterForm.value.type==="Location")
    {
      formData.append('range', this.encounterForm.value.range?.toString()||"");
      formData.append('locationLongitude', this.encounterForm.controls.locationLongitude.value?.toString()||"");
      formData.append('locationLatitude', this.encounterForm.controls.locationLatitude.value?.toString()||"");
      if (this.encounterForm.value.images) {
        const selectedFiles = this.encounterForm.value.images;
          formData.append('imageF', selectedFiles[0]);

      }
    }

    if(this.edit==false){

    this.service.addTouristEncounter(formData,this.encounterForm.value.checkpointId || -1,this.encounterForm.value.isPrerequisite|| false).subscribe({
      next: () => {
        this.encounterForm.reset();
        this.imagePreview = [];
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }else{
    formData.append('id', this.encounterId.toString()||"");

    this.service.editEncounter(formData).subscribe({
      next: () => {
        this.encounterForm.reset();
        this.imagePreview = [];
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });
  }



    this.router.navigate([`home`]);
  }



  onChange(){
    this.type=this.encounterForm.value.type||"";

  }

  onImageSelected(event: any): void {
    const selectedFiles = event?.target?.files;

    if (selectedFiles && selectedFiles.length > 0) {
      this.imagePreview = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imagePreview.push(e.target?.result as string);
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
    }
    this.encounterForm.get('images')?.setValue(selectedFiles);
  }
  
  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }

  ngOnChanges(): void {
      this.imagePreview = this.encounter.image?.map(image => this.getImageUrl(image)) || [];
  }

  onDelete():void{
    this.service.deleteEncounter(this.id).subscribe({
      next: () => {
       this.edit=false;
       this.encounterForm.reset();
        this.router.navigate([`checkpoint-secret/${this.id}`]);
        alert("Encounter is deleted");

      }
    });
  }


  onMapClick(event: { lat: number; lon: number }) {
    this.searchByCoord(event.lat, event.lon);
  }

  private searchByCoord(lat: number, lon: number) {
    this.mapComponent.reverseSearch(lat, lon).subscribe({
      next: (location) => {
        // Handle the location data here
        const foundLocation = location;
        console.log('Found Location Lat:', foundLocation.lat);
        console.log('Found Location Lon:', foundLocation.lon);
        console.log('Found Location Name:', foundLocation.display_name);
        this.encounterForm.controls.locationLatitude.setValue(foundLocation.lat);
        this.encounterForm.controls.locationLongitude.setValue(foundLocation.lon);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  onCheckpointSelected(checkpointId: number | undefined): void {
    // Dobijte izabrani checkpoint
    console.log('onCheckpointSelected called');
    const selectedCheckpoint = this.checkpoints.find(checkpoint => checkpoint.id === checkpointId);
    this.checkpointID = checkpointId;
    // Postavite vrednosti za longitude i latitude
    if (selectedCheckpoint) {
      this.encounterForm.get('longitude')?.setValue(selectedCheckpoint.longitude);
      this.encounterForm.get('latitude')?.setValue(selectedCheckpoint.latitude);
      this.longitude = selectedCheckpoint.longitude;
      this.latitude = selectedCheckpoint.latitude;
    }
  }
}
