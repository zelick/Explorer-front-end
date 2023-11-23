import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'xp-forecast-popup',
  templateUrl: './forecast-popup.component.html',
  styleUrls: ['./forecast-popup.component.css']
})
export class ForecastPopupComponent {
  
  API_KEY = '7627e6571c32cb8b22fcfa40527a8397';
  WeatherData:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public popupData: any // Add weatherData property
  ) {
    console.log(this.popupData.lat); // Access weatherData here
    console.log(this.popupData.lon);
  }

  ngOnInit() {
    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData();
    //console.log(this.WeatherData);
  }

  getWeatherData() {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${this.popupData.lat}&lon=${this.popupData.lon}&appid=${this.API_KEY}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        this.setWeatherData(data); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);

      });
  }

  setWeatherData(data: any){
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
    this.WeatherData.humidity = this.WeatherData.main.humidity;
    console.log('Processed Weather Data:', this.WeatherData);
  }


}
