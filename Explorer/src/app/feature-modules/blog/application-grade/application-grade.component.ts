import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-application-grade',
  templateUrl: './application-grade.component.html',
  styleUrls: ['./application-grade.component.css']
})
export class ApplicationGradeComponent {

  applicationGradeForm = new FormGroup({
    Rating: new FormControl('', [Validators.required]),
    Comment: new FormControl('')
  })
}
