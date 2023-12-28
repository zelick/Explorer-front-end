import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TourAuthoringService } from "../tour-authoring.service";
import { AuthService } from "src/app/infrastructure/auth/auth.service";
import { User } from "src/app/infrastructure/auth/model/user.model";
import { forkJoin } from "rxjs";


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
    numberOfToursInRange: number = 0;
    y1: number = 0;
    y2: number = 0;
    y3: number = 0;
    y4: number = 0;

    chartOptions: any;
    chartOptions2: any;
    
    constructor(
        private service: TourAuthoringService, 
        private authService: AuthService,
        private cdr: ChangeDetectorRef) { }
        
    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            this.user = user;

            this.getAuthorsSoldToursNumber();
            this.getAuthorsStartedToursNumber();
            this.getAuthorsFinishedToursNumber();
            this.getAuthorsTourCompletionPercentage();

            this.getToursInCompletionRangeCount();
        });
    }

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

    getToursInCompletionRangeCount() {
        this.service.getToursInCompletionRangeCount(this.user.id, 0, 25).subscribe({
            next: (result: number) => {
              console.log('Broj u opsegu: ', result);
              this.y1 = result;
              this.updateChartOptions2();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju tura u opsegu');
            }
        });

        this.service.getToursInCompletionRangeCount(this.user.id, 26, 50).subscribe({
            next: (result: number) => {
              console.log('Broj u opsegu: ', result);
              this.y2 = result;
              this.updateChartOptions2();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju tura u opsegu');
            }
        });

        this.service.getToursInCompletionRangeCount(this.user.id, 51, 75).subscribe({
            next: (result: number) => {
              console.log('Broj u opsegu: ', result);
              this.y3 = result;
              this.updateChartOptions2();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju tura u opsegu');
            }
        });

        this.service.getToursInCompletionRangeCount(this.user.id, 76, 100).subscribe({
            next: (result: number) => {
              console.log('Broj u opsegu: ', result);
              this.y4 = result;
              this.updateChartOptions2();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju tura u opsegu');
            }
        });
    }
    /*
    getToursInCompletionRangeCount(minPercentage: number, maxPercentage: number) {
        this.service.getToursInCompletionRangeCount(this.user.id, minPercentage, maxPercentage).subscribe({
            next: (result: number) => {
              console.log('Broj u opsegu: ', result);
              this.numberOfToursInRange = result;
              //this.updateChartOptions();
            },
            error: (error) => {
              console.log(error);
              console.log('Error pri dobavljanju tura u opsegu');
            }
        });
    } 
    */

    updateChartOptions2() {
        console.log(this.y1)
        console.log(this.y2)
        console.log(this.y3)
        console.log(this.y4)
        this.chartOptions2 = {
            theme: "dark2",
            title: {
                text: "Distribution of tour completions"
            },
            backgroundColor: "#B6D4AF",
            animationEnabled: true,
            axisX: {
                interval: 25,
                valueFormatString: " "
            },
            axisY: {
                title: "Number of Tours",
                titleFontSize: 18,
                labelFontSize: 18
            },
            data: [{
                type: "column",
                indexLabelFontSize: 18,
                dataPoints: [
                    { x: 12.5, y: this.y1, indexLabel: "0% - 25%", indexLabelPlacement: "outside", color: "#E67840" },
                    { x: 37.5, y: this.y2, indexLabel: "26% - 50%", indexLabelPlacement: "outside", color: "#3B846B" },
                    { x: 62.5, y: this.y3, indexLabel: "51% - 75%", indexLabelPlacement: "outside", color: "#E67840" },
                    { x: 87.5, y: this.y4, indexLabel: "76% - 100%", indexLabelPlacement: "outside", color: "#3B846B" }
                ],
                toolTipContent: "Number of tours that are in this range: {y}"
            }]
        };
    } 

    /*

    updateChartOptions2() {
        forkJoin([
            this.getToursInCompletionRangeCount(0, 25),
            this.getToursInCompletionRangeCount(25, 50),
            this.getToursInCompletionRangeCount(50, 75),
            this.getToursInCompletionRangeCount(75, 100)
        ]).subscribe({
            next: ([count0to25, count25to50, count50to75, count75to100]) => {
                console.log('Counts:', count0to25, count25to50, count50to75, count75to100);

                if (
                    !isNaN(count0to25) &&
                    !isNaN(count25to50) &&
                    !isNaN(count50to75) &&
                    !isNaN(count75to100)
                ) {
                    this.chartOptions2 = {
                        theme: "dark2",
                        title: {
                            text: "Distribution of tour completions"
                        },
                        backgroundColor: "#B6D4AF",
                        animationEnabled: true,
                        axisX: {
                            interval: 25,
                            valueFormatString: " "
                        },
                        axisY: {
                            title: "Number of Tours",
                            titleFontSize: 18,
                            labelFontSize: 18
                        },
                        data: [{
                            type: "column",
                            indexLabelFontSize: 18,
                            dataPoints: [
                                { x: 12.5, y: count0to25, indexLabel: "0% - 25%", indexLabelPlacement: "outside", color: "#E67840" },
                                { x: 37.5, y: count25to50, indexLabel: "25% - 50%", indexLabelPlacement: "outside", color: "#3B846B" },
                                { x: 62.5, y: count50to75, indexLabel: "50% - 75%", indexLabelPlacement: "outside", color: "#E67840" },
                                { x: 87.5, y: count75to100, indexLabel: "75% - 100%", indexLabelPlacement: "outside", color: "#3B846B" }
                            ],
                            toolTipContent: "Number of tours that are in this range: {y}"
                        }]
                    };

                    // Koristi cdr.detectChanges() kako bi se osiguralo ažuriranje prikaza
                    this.cdr.detectChanges();
                } else {
                    console.log('Invalid counts received.');
                }
            },
            error: (error) => {
                console.log(error);
                console.log('Error fetching tour counts in range');
            }
        });
    }

    getToursInCompletionRangeCount(minPercentage: number, maxPercentage: number) {
        return this.service.getToursInCompletionRangeCount(this.user.id, minPercentage, maxPercentage);
    }

    */
    
}