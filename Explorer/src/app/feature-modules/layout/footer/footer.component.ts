import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  ratingExists: boolean = false;
  user: User | undefined;

  constructor(private layoutService: LayoutService,private authService: AuthService) {}
  
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    if(!this.user || this.user.role === ''){
      
      this.ratingExists = true;
      return;
    }
    this.layoutService.checkRatingExistence(this.user.id)
      .subscribe(exists => {
        this.ratingExists = exists;
      });
  }
}
