import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { LocationResponse } from '../model/location-response';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { MAPBOX_API_KEY } from '../constants';
import { RouteResponse } from '../model/RouteResponse';
import { ElevationResponse } from '../model/elevation-response';

@Component({
  selector: 'xp-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Output() mapClick: EventEmitter<any> = new EventEmitter();
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13
  
  private map: any;

  constructor(private mapService: MapService) { }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCenter,
      zoom: this.initialZoom,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.registerOnClick();
  }

  search(street: string): Observable<LocationResponse> {
    return this.mapService.search(street).pipe(
      map((result) => result[0]),
      tap((location) => {
        console.log('Location:', location);
        L.marker([location.lat, location.lon])
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in search:', error);
        throw error;
      })
    );
  }

  reverseSearch(lat: number, lon: number): Observable<LocationResponse> {
    return this.mapService.reverseSearch(lat, lon).pipe(
      map((result) => result),
      tap((location) => {
        console.log('Location:', location);
        L.marker([location.lat, location.lon])
          .addTo(this.map)
          .bindPopup(location.display_name)
          .openPopup();
      }),
      catchError((error) => {
        console.error('Error in reverse search:', error);
        throw error;
      })
    );
  }

  getElevation(lat: number, lon: number): Observable<number> {

    return this.mapService.getElevation(lat, lon).pipe(
      map((response) => response.results[0].elevation),
      tap((elevation) => {
        console.log('Elevation:', elevation);
      }),
      catchError((error) => {
        console.error('Error in elevation fetch:', error);
        throw error;
      })
    );
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      console.log(
        'You clicked the map at latitude: ' + lat + ' and longitude: ' + lng
      );
      this.mapClick.emit({ lat, lon: lng });
    });
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

  setRoute(startCoords: { lat: number, lon: number }, endCoords: { lat: number, lon: number }, profile: string): Observable<RouteResponse> {
    const startLatLng = L.latLng(startCoords.lat, startCoords.lon);
    const endLatLng = L.latLng(endCoords.lat, endCoords.lon);

    return new Observable((observer) => {
      const routeControl = L.Routing.control({
        waypoints: [startLatLng, endLatLng],
        router: L.routing.mapbox(MAPBOX_API_KEY, { profile: `mapbox/${profile}` })
      }).addTo(this.map);

      routeControl.on('routesfound', function (e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        const routeResponse: RouteResponse = {
          totalDistanceMeters: summary.totalDistance,
          totalTimeMinutes: Math.round(summary.totalTime / 60)
        };
        console.log('Total distance is ' + summary.totalDistance + 'meters and total time is ' + summary.totalTime + ' seconds');

        observer.next(routeResponse);
        observer.complete();
      });
    });
  }
}
