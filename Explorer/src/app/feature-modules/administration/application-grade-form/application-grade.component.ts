import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../blog/blog.service';
import { ApplicationGrade } from '../model/applicationGrade.model';
import { AdministrationService } from '../administration.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-application-grade',
  templateUrl: './application-grade.component.html',
  styleUrls: ['./application-grade.component.css']
})
export class ApplicationGradeComponent implements OnInit {

  user: User | undefined;
  now: Date = new Date();
  
  constructor(private service: AdministrationService, 
              private authService: AuthService) { }
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
  
  applicationGradeForm = new FormGroup({
    Rating: new FormControl(1, [Validators.required]),
    Comment: new FormControl(''),
    Created: new FormControl(),
    UserId: new FormControl('')
  })

  noteTheRate(): void {
    const formData = this.applicationGradeForm.value;
  
    this.service.noteTheRate({
      rating: formData.Rating || 1,
      comment: formData.Comment || "",
      created: new Date(this.now.getUTCFullYear(), this.now.getUTCMonth(), this.now.getUTCDate(), this.now.getUTCHours(), this.now.getUTCMinutes(), this.now.getUTCSeconds()),
      userId: this.user?.id.toString() || ""
    }).subscribe({
      next: (_) => {
        console.log("Uspješan zahtjev!");
        this.applicationGradeForm.reset();
      }
    });
  }
  
}
