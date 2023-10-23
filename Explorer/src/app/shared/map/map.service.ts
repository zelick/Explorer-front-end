import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResponse } from '../model/location-response';
import { ElevationResponse } from '../model/elevation-response';

@Injectable({
  providedIn: 'root',
})
export class MapService {
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

  getElevation(lat: number, lon: number): Observable<ElevationResponse> {
    return this.http.get<ElevationResponse>(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}d`
    );
  }
}