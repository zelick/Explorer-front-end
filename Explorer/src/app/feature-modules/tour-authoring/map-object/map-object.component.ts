import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapObject } from '../model/map-object.model';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { NgModel, NgForm } from '@angular/forms';
import { TourAuthoringService } from '../tour-authoring.service';

@Component({
  selector: 'xp-map-object',
  templateUrl: './map-object.component.html',
  styleUrls: ['./map-object.component.css']
})
export class MapObjectComponent {
  mapObjects: MapObject[] = [];
  selectedMapObject: MapObject;

  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {

    this.service.getMapObjects().subscribe({
      next: (result: PagedResults<MapObject>) => {
        console.log(result);
        this.mapObjects = result.results;
      },
      error: () => {
        // Handle error if needed
      }
    });
  }
   
}
