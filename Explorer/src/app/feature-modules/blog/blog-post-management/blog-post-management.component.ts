import { Component, OnInit } from '@angular/core';
import { BlogPost, BlogPostStatus } from '../model/blog-post.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-blog-post-management',
  templateUrl: './blog-post-management.component.html',
  styleUrls: ['./blog-post-management.component.css']
})

export class BlogPostManagementComponent implements OnInit {

  public BlogPostStatus = BlogPostStatus;
  blogPosts: BlogPost[] = [];
  selectedBlogPost: BlogPost;
  shouldRenderBlogPostForm: boolean = false;
  shouldEdit: boolean = false;
  userId: number;

  constructor(private service: BlogService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
    this.getBlogPosts();
  }

  getBlogPosts(): void {
    this.service.getBlogPostsByUser(this.userId).subscribe({
      next: (result: PagedResults<BlogPost>) => {
        this.blogPosts = result.results
      },
      error: () => {
      }
    })
  }

  onRowSelected(selectedBlogPost: BlogPost): void {
    this.router.navigate(['/blogs', selectedBlogPost.id]);
  }

  deleteBlogPost(id: number): void {
    const result = window.confirm('Are you sure you want to delete this blog post?');
    if (result) {
      this.service.deleteBlogPost(id).subscribe({
        next: () => {
          this.getBlogPosts();
        },
      })
    }
  }

  onEditClicked(blogPost: BlogPost): void {
    this.selectedBlogPost = blogPost;
    this.shouldRenderBlogPostForm = true;
    this.shouldEdit = true;
  }

  onAddClicked(): void {
    this.shouldEdit = false;
    this.shouldRenderBlogPostForm = true;
  }

  onCloseClicked(blogPost: BlogPost): void {
    if (blogPost.id) {
      this.service.closeBlog(blogPost.id).subscribe({
        next: () => {
          this.getBlogPosts();
        },
      })
    }
  }
}
