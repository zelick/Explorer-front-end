import { Component, OnInit } from '@angular/core';
import { ApplicationGrade } from '../../model/applicationGrade.model';
import { AdministrationService } from '../../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-grade-review',
  templateUrl: './grade-review.component.html',
  styleUrls: ['./grade-review.component.css']
})
export class GradeReviewComponent implements OnInit {
 
  grades: ApplicationGrade[] = [];

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAllGrades()
  }

  getAllGrades(): void {
    this.service.getAllGrades().subscribe({
        next: (grades: ApplicationGrade[]) => {
            this.grades = grades;
        },
        error: () => {
            // Handle errors
        }
    });
}
}
