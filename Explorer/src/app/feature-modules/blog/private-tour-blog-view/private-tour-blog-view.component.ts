import { Component } from '@angular/core';
import { PrivateTour } from '../../tour-authoring/model/private-tour.model';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog.service';
import { MAPBOX_API_KEY } from 'src/app/shared/constants';
import * as L from 'leaflet';

@Component({
  selector: 'xp-private-tour-blog-view',
  templateUrl: './private-tour-blog-view.component.html',
  styleUrls: ['./private-tour-blog-view.component.css']
})
export class PrivateTourBlogViewComponent {
  tour: PrivateTour;
  durationHours: number;
  durationMinutes: number;
  distance: Promise<string>;

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tourId = params['id'];
      if (tourId) {
        this.blogService.getPrivateTour(tourId).subscribe(async result => {
          this.tour = result;
          if (this.tour.execution) {
            const startDate = new Date(this.tour.execution.startDate);
            const endDate = new Date(this.tour.execution.endDate);
            const durationInMs = endDate.getTime() - startDate.getTime();

            this.durationHours = Math.floor(durationInMs / (1000 * 60 * 60));
            this.durationMinutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));

            const distances: number[] = [];

            for(let i=0; i < this.tour.checkpoints.length-1; i++){
              const startCoords: { lat: number; lon: number } = {
                lat: this.tour.checkpoints[i].latitude,
                lon: this.tour.checkpoints[i].longitude
              };
  
              const endCoords: { lat: number; lon: number } = {
                lat: this.tour.checkpoints[i+1].latitude,
                lon: this.tour.checkpoints[i+1].longitude
              };
  
              const distance = await this.calculateDistance([startCoords, endCoords], 'walking');
              distances.push(distance);
            }
            const totalDistance = distances.reduce((acc, val) => acc + val, 0);
          this.distance = Promise.resolve(this.formatDistance(totalDistance));
          }
        });
      }
    });
  }

  formatDistance(distanceInMeters: number): string {
    const distanceInKilometers = distanceInMeters / 1000;
    return distanceInKilometers.toFixed(2) + 'km';
  }

  calculateDistance(coords: { lat: number; lon: number }[], profile: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const waypoints = coords.map(coord => L.latLng(coord.lat, coord.lon));
      const routing = L.Routing.control({
        waypoints: waypoints,
        router: L.routing.mapbox(MAPBOX_API_KEY, { profile: `mapbox/${profile}` }),
      });
  
      routing.on('routesfound', (e) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distance = summary.totalDistance; // Distance in meters
        resolve(distance);
      });
  
      routing.route();
    });
  }

}
