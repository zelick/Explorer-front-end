import { Component, OnInit } from "@angular/core";
import { TourAuthoringService } from "../tour-authoring.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { User } from "src/app/infrastructure/auth/model/user.model";


@Component({
    selector: 'xp-tour-statistics',
    templateUrl: './tour-statistics.component.html',
    styleUrls: ['./tour-statistics.component.css']
})
export class TourStatisticsComponent implements OnInit {

    user: User;
    numberOfSoldTours: number = 0;
    numberOfStartedTours: number = 0;
    numberOfFinishedTours: number = 0;
    finishedToursPercentage: number = 0;
    
    constructor(
        private service: TourAuthoringService, 
        private authService: AuthService) { }
        
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;

            this.getAuthorsSoldToursNumber();
            this.getAuthorsStartedToursNumber();
            this.getAuthorsFinishedToursNumber();
            this.getAuthorsTourCompletionPercentage();
        });
    }

    chartOptions: any;

    getAuthorsSoldToursNumber() {
        this.service.getAuthorsSoldToursNumber(this.user.id).subscribe({
            next: (result: number) => {
              console.log('Broj prodatih tura: ', result);
              this.numberOfSoldTours = result;
              this.updateChartOptions();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju broja prodatih tura');
            }
        });
    }
      
    getAuthorsStartedToursNumber() {
        this.service.getAuthorsStartedToursNumber(this.user.id).subscribe({
            next: (result: number) => {
              console.log('Broj pokrenutih tura: ', result);
              this.numberOfStartedTours = result;
              this.updateChartOptions();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju broja pokrenutih tura');
            }
        });
    }
      
    getAuthorsFinishedToursNumber() {
        this.service.getAuthorsFinishedToursNumber(this.user.id).subscribe({
            next: (result: number) => {
              console.log('Broj zavrsenih tura: ', result);
              this.numberOfFinishedTours = result;
              this.updateChartOptions();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju broja zavrsenih tura');
            }
        });
    }

    
    getAuthorsTourCompletionPercentage() {
        this.service.getAuthorsTourCompletionPercentage(this.user.id).subscribe({
            next: (result: number) => {
              console.log('Procenat zavrsenosti tura: ', result);
              this.finishedToursPercentage = result;
              this.updateChartOptions();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju procenta zavrsenosti tura');
            }
        });
    }

    updateChartOptions() {
        if (this.numberOfFinishedTours !== undefined && this.numberOfStartedTours !== undefined) {
            this.chartOptions = {
                animationEnabled: true,
                theme: "dark2",
                title:{
                    text: "Finished tours statistics",
                    
                },
                backgroundColor: "#B6D4AF",
                data: [{
                    type: "pie",
                    startAngle: -90,
                    indexLabel: "{name}: {y}",
                    yValueFormatString: "#,###.##'%'",
                    indexLabelFontSize: 18,
                    dataPoints: [
                        { y: this.finishedToursPercentage, name: "Finished tours", color: "#3B846B" },
                        { y: 100 - this.finishedToursPercentage, name: "Started tours", color: "#E67840" }, 
                    ]
                }]
            };
        }
    }
}