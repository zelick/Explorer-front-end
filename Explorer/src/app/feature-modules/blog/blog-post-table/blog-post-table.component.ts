import { Component, OnInit } from '@angular/core';
import { BlogPost, BlogPostStatus } from '../model/blog-post.model';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'xp-blog-post-table',
  templateUrl: './blog-post-table.component.html',
  styleUrls: ['./blog-post-table.component.css']
})
export class BlogPostTableComponent implements OnInit {

  blogPosts: BlogPost[] = [];
  selectedStatus?: BlogPostStatus;
  pageSize = 5;
  pageIndex = 1;
  totalBlogPosts = 0;

  constructor(private service: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  loadBlogPosts(): void {
    this.service.getBlogPosts(this.pageIndex, this.pageSize, this.selectedStatus).subscribe((result) => {
      this.blogPosts = result.results;
      this.totalBlogPosts = result.totalCount;
    });
  }

  onRowSelected(selectedBlogPost: BlogPost): void {
    this.router.navigate(['/blogs', selectedBlogPost.id]);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;
    this.loadBlogPosts();
  }

  onPageSizeChange(event: any): void {
    this.pageSize = event.value;
    this.pageIndex = 1;
    this.loadBlogPosts();
  }
}