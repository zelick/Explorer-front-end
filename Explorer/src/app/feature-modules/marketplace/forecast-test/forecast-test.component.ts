import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ForecastPopupComponent } from '../forecast-popup/forecast-popup.component';

@Component({
  selector: 'xp-forecast-test',
  templateUrl: './forecast-test.component.html',
  styleUrls: ['./forecast-test.component.css']
})
export class ForecastTestComponent {
  lat: number = 45.2671;
  lon: number = 19.8335;

  //lat: number = 51.5074;
  //long: number = -0.1278;

  constructor( public dialog:MatDialog) {

  }


  showWeatherForecast(lat: number, lon:number){

        const result={
          lat: lat,
          lon: lon,
        }

        this.dialog.open(ForecastPopupComponent, {
          data: result,
           width: '1000px',
           height:'600px',
           panelClass: 'custom-dialog',
         });
         console.log(result);


  }




}
