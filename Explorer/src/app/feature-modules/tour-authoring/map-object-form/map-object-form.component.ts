import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MapObject } from '../model/map-object.model';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-map-object-form',
  templateUrl: './map-object-form.component.html',
  styleUrls: ['./map-object-form.component.css'],
})
export class MapObjectFormComponent implements OnChanges {
  @Output() mapObjectUpdated = new EventEmitter<void>();
  @Input() selectedMapObject: MapObject;
  @Input() shouldEdit: boolean = false;

  mapObjectForm = new FormGroup({
    longitude: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    pictureURL: new FormControl('', [Validators.required]),
  });

  constructor(private service: TourAuthoringService) {}

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

    this.service.addMapObject(mapObject).subscribe({
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
