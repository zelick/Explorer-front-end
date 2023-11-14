import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BlogService } from '../blog.service';
import { BlogPost, BlogPostStatus } from '../model/blog-post.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { BlogRating, Rating } from '../model/blog-rating.model';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})

export class BlogPostComponent implements OnInit {

  @Output() blogPostUpdated = new EventEmitter<null>();
  public BlogPostStatus = BlogPostStatus;
  blogPost: BlogPost;
  userId: number;
  upvoteCount: number = 0;
  downvoteCount: number = 0;
  netVoteCount: number = 0;
  upvoted = false;
  downvoted = false;

  constructor(private service: BlogService, private route: ActivatedRoute, private authService: AuthService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.userId = this.authService.user$.value.id;
  
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.service.getBlogPost(id);
      })
    ).subscribe((blogPost: BlogPost) => {
      this.blogPost = blogPost;
      this.calculateVoteCounts();
      this.updateUserRating();
    });
  }

  getBlogPost(): void {
    if (this.blogPost?.id !== undefined){
      this.service.getBlogPost(this.blogPost.id).subscribe({
        next: (updatedBlogPost: BlogPost) => {
          this.blogPost = updatedBlogPost;
          this.calculateVoteCounts();
          this.blogPostUpdated.emit();
        },
      });
    }
  }
  
  onUpvoteClicked(): void {
    if (this.blogPost?.id !== undefined) {
      const rating: BlogRating = {
        userId: this.userId,
        rating: Rating.Upvote,
      };
  
      this.service.rateBlogPost(this.blogPost.id, rating).subscribe({
        next: () => {
          this.upvoted = !this.upvoted;
          this.downvoted = false;
          this.getBlogPost();
        }
      });
    }
  }

  onDownvoteClicked(): void {
    if (this.blogPost?.id !== undefined) {
      const rating: BlogRating = {
        userId: this.userId,
        rating: Rating.Downvote,
      };
  
      this.service.rateBlogPost(this.blogPost.id, rating).subscribe({
        next: () => {
          this.upvoted = false;
          this.downvoted = !this.downvoted;
          this.getBlogPost();
        }
      });
    }
  }

  calculateVoteCounts(): void {
    if (this.blogPost?.ratings) {
      this.upvoteCount = this.blogPost.ratings.filter(rating => rating.rating === Rating.Upvote).length;
      this.downvoteCount = this.blogPost.ratings.filter(rating => rating.rating === Rating.Downvote).length;
      this.netVoteCount = this.upvoteCount - this.downvoteCount;
    }
  }

  updateUserRating(): void {
    if (this.userId && this.blogPost.ratings) {
      const userRating = this.blogPost.ratings.find(rating => rating.userId === this.userId);
      if (userRating) {
        this.upvoted = userRating.rating === Rating.Upvote;
        this.downvoted = userRating.rating === Rating.Downvote;
      }
    }
  }

  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}