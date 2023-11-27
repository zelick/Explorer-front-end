import { Component, OnInit } from '@angular/core';
import { ApplicationGrade } from '../../model/applicationGrade.model';
import { AdministrationService } from '../../administration.service';

@Component({
  selector: 'xp-grade-review',
  templateUrl: './grade-review.component.html',
  styleUrls: ['./grade-review.component.css']
})
export class GradeReviewComponent implements OnInit {
 
  grades: ApplicationGrade[] = [];
  average: number = 0;
  hasRatings: boolean = true;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAllGrades();
  }

  getAllGrades(): void {
    this.service.getAllGrades().subscribe({
        next: (grades: ApplicationGrade[]) => {
            this.grades = grades;
            this.getAverage();
        },
        error: () => {
            // Handle errors
        }
    });
  }

  getAverage(): void{
    if (this.grades.length > 0) {
      let sum = 0;
      for (let i = 0; i < this.grades.length; i++) {
        sum += this.grades[i].rating;
      }
      this.average = sum / this.grades.length;
      this.hasRatings = true;
    } else {
      this.average = 0;
      this.hasRatings = false;
    }
  }
}
