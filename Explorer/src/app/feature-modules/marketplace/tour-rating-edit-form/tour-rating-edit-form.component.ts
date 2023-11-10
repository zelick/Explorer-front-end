import { Component, Input } from '@angular/core';
import { TourRating } from '../model/tour-rating.model';

@Component({
  selector: 'xp-tour-rating-edit-form',
  templateUrl: './tour-rating-edit-form.component.html',
  styleUrls: ['./tour-rating-edit-form.component.css']
})
export class TourRatingEditFormComponent {
  @Input() rating: TourRating;
}
