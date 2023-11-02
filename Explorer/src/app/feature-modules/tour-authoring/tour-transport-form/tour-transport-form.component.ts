import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';
import { TourAuthoringService } from '../tour-authoring.service';


@Component({
  selector: 'xp-tour-transport-form',
  templateUrl: './tour-transport-form.component.html',
  styleUrls: ['./tour-transport-form.component.css']
})
export class TourTransportFormComponent implements OnInit{
  transports: string[] = ['walking', 'cycling', 'driving'];
  availableProfiles: string[];
  chosenProfiles: string[];
  @Input() tourID: number;
  tour: Tour;
  @Output() changedSelection: EventEmitter<null> = new EventEmitter<null>();

  constructor(private service: TourAuthoringService) { }

  ngOnInit(): void {
    this.service.get(this.tourID).subscribe((result: Tour) => {  
      this.tour = result;
      this.makeChosenProfiles();
      this.makeAvailableProfiles();    
   });
  }

  makeChosenProfiles(): void{
    this.chosenProfiles = [];
    this.tour.tourTimes.forEach(element => {
      if(!this.chosenProfiles.includes(element.transportation))
      this.chosenProfiles.push(element.transportation);
    });
  }

  makeAvailableProfiles(): void{
    this.availableProfiles = [];
    this.transports.forEach(element => {
      if(!this.chosenProfiles.includes(element))
      this.availableProfiles.push(element);
    });
  }

  onAdd(t: string): void{
    this.chosenProfiles.push(t);
    this.makeAvailableProfiles();
  }

  onDelete(t: string): void{
    this.chosenProfiles.splice(this.chosenProfiles.indexOf(t), 1);
    this.makeAvailableProfiles();
  }

  onSave(): void{
    this.changedSelection.emit();
  }
}
