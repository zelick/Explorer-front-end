import { ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CheckpointStatistics } from '../model/checkpoint-statistics.model';

@Component({
  selector: 'xp-checkpoint-statistics',
  templateUrl: './checkpoint-statistics.component.html',
  styleUrls: ['./checkpoint-statistics.component.css'], 
})
export class CheckpointStatisticsComponent implements OnInit {

  user: User;
  tourId: number;
  checkpointStatistics: CheckpointStatistics[] = [];

  chartOptionsCheckpoints: any = {};

  constructor(private service: TourAuthoringService, private authService: AuthService, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute) {
  
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.tourId = params['id'];
      this.authService.user$.subscribe(user => {
        this.user = user;
        //dobavi celu turu, zbog prikaza
        this.getNumberOfTourSales();
        this.getNumberOfTourStartings();
        this.getNumberOfTourFinishings();
        this.getCheckpointStatistics();
      });
    });
  }

  getNumberOfTourSales() {
    this.service.getTourSalesCount(this.user.id, this.tourId).subscribe({
      next: (result: number) => {
        console.log('Broj prodaja ture: ', result);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getNumberOfTourStartings() {
    this.service.getTourStartingsCount(this.user.id, this.tourId).subscribe({
      next: (result: number) => {
        console.log('Broj zapocinjanja ture: ', result);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getNumberOfTourFinishings() {
    this.service.getTourStartingsCount(this.user.id, this.tourId).subscribe({
      next: (result: number) => {
        console.log('Broj zavrsavanja ture: ', result);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getCheckpointStatistics() {
    this.service.getCheckpointStatistics(this.tourId).subscribe({
      next: (result: CheckpointStatistics[]) => {
        console.log('Statistika checkpoints: ', result);
        this.checkpointStatistics = result;
        this.drawChart(); 
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  drawChart(): void {
    this.chartOptionsCheckpoints = {
      title: {
        text: "Chekpoints statistics"  
      },
      animationEnabled: true,
      data: [{        
        type: "column",
        dataPoints: this.checkpointStatistics.map(stat => ({
          label: stat.checkpointName,
          y: stat.arrivalPercentage
        }))
      }]
    };	
    // Manually trigger change detection
    this.cdr.detectChanges();
  }
}
