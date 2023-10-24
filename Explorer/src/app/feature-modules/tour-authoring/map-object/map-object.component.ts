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
  shouldRenderMapObjectForm: boolean = false;
  selectedMapObject: MapObject;
  shouldEdit: boolean = false;

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

  onAddClick(): void {
    
    this.shouldRenderMapObjectForm = true;
    this.shouldEdit = false;


  }

  onUpdate(): void {
    
    this.shouldRenderMapObjectForm = false;
    this.shouldEdit = false;
    this.ngOnInit();
    

  }

  onEdit(mapObject: MapObject): void {
    
    this.shouldEdit = true;
    this.selectedMapObject = mapObject;
    this.shouldRenderMapObjectForm = true;

  }

  onDelete(id: number): void {
    this.service.deleteMapObject(id).subscribe({
      next: () => {
        this.ngOnInit();
      },
    });
  }

   
}
