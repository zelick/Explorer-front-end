import { Component, OnInit } from '@angular/core';
import { BlogPost, BlogPostStatus } from '../model/blog-post.model';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ImageService } from 'src/app/shared/image/image.service';
import { Rating } from '../model/blog-rating.model';

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

  constructor(private service: BlogService, private router: Router, private imageService: ImageService) { }

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
  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
  getUpvoteCount(blog: BlogPost): number {
    return blog.ratings ? blog.ratings.filter(rating => rating.rating === Rating.Upvote).length : 0;
  }

  getDownvoteCount(blog: BlogPost): number {
      return blog.ratings ? blog.ratings.filter(rating => rating.rating === Rating.Downvote).length : 0;
  }
  get thumbsUpEmoji(): string {
    return '\u{1F44D}';
  }

  get thumbsDownEmoji(): string {
    return '\u{1F44E}';
  }
}