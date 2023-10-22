import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResponse } from '../model/location-response';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private mapboxAccessToken = 'pk.eyJ1IjoibWF0aWphcHN3IiwiYSI6ImNsbzIxcWVqaDA2eG4yaW13ODI3ejY0Y3gifQ.1ZAt45LlVgZVOE9E1O4kyQ';
  constructor(private http: HttpClient) { }

  search(street: string): Observable<LocationResponse[]> {
    return this.http.get<LocationResponse[]>(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<LocationResponse> {
    return this.http.get<LocationResponse>(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }

  getElevation(latitude: number, longitude: number): Observable<any> {
    const location = `${latitude},${longitude}`;
    const url = `https://api.open-elevation.com/api/v1/lookup?locations=${location}`;
    //const url = `https://cors-anywhere.herokuapp.com/api.open-elevation.com/api/v1/lookup?locations=${location}`;
    return this.http.get(url);
  }

}