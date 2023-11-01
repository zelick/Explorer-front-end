import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tour } from '../model/tour.model';


@Component({
  selector: 'xp-tour-transport-form',
  templateUrl: './tour-transport-form.component.html',
  styleUrls: ['./tour-transport-form.component.css']
})
export class TourTransportFormComponent {
  transports: string[] = ['walking', 'cycling', 'driving'];
  selectedTransports: string[] = [];
  @Output() savedTransports: EventEmitter<any> = new EventEmitter<any>();


  onChange(value: string): void {
    if (this.selectedTransports.indexOf(value) == -1) {
      this.selectedTransports.push(value);
    }
  }

  save(): void{
    this.savedTransports.emit(this.selectedTransports);
    this.selectedTransports = [];
  }
}
