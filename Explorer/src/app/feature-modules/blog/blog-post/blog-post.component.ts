import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogPost } from '../model/blog-post.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'xp-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit {

  blogPost: BlogPost;

  constructor(private service: BlogService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.service.getBlogPost(id); 
      })
    ).subscribe((blogPost: BlogPost) => {
      this.blogPost = blogPost;
    });
  }
}
