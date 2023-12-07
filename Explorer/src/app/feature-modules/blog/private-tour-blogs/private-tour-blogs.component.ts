import { Component, OnInit } from '@angular/core';
import { PrivateTourBlog } from '../model/private-tour-blog';
import { BlogService } from '../blog.service';
import { PrivateTour } from '../../tour-authoring/model/private-tour.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-private-tour-blogs',
  templateUrl: './private-tour-blogs.component.html',
  styleUrls: ['./private-tour-blogs.component.css']
})

export class PrivateTourBlogsComponent implements OnInit {
  toursWithBlogs: PrivateTour[] = [];
  tours: PrivateTour[];

  constructor(private service: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.service.getPrivateTours().subscribe(result=>{
      if(result){
        this.tours = result;
        this.tours.forEach(t => {
          if (t.blog) {
            this.toursWithBlogs = this.toursWithBlogs.concat(t);
          }
        });
      }
      else{
        console.log('Error while loading the private tour blogs.');
      }
    })
  }

  readBlog(tour: any) {
    console.log('Reading tour with blog:', tour);
    this.router.navigate(['private-tour-blog-view/' + tour.id]);
  }
}
