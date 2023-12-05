import { Component } from '@angular/core';
import { PrivateTour } from '../../tour-authoring/model/private-tour.model';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog.service';

@Component({
  selector: 'xp-private-tour-blog-view',
  templateUrl: './private-tour-blog-view.component.html',
  styleUrls: ['./private-tour-blog-view.component.css']
})
export class PrivateTourBlogViewComponent {
  tour: PrivateTour;

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tourId = params['id'];
      if (tourId) {
        this.blogService.getPrivateTour(tourId).subscribe(result => {
          this.tour = result;
        });
      }
    });
  }
}
