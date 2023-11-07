import { Component, OnInit, Input } from '@angular/core';
import { BlogComment } from '../model/blogComment.model';
import { BlogService } from '../blog.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.css']
})

export class BlogCommentComponent implements OnInit {

  @Input() blogPostId: number | undefined;
  blogComments: BlogComment[] = [];
  selectedBlogComment: BlogComment;
  shouldRenderBlogCommentForm: boolean = false;
  shouldEdit: boolean = false;
  showOptions: number | null = null;
  userId: number;

  constructor(private service: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.user$.value.id;
    this.getBlogComments();
  }

  getBlogComments(): void {
    this.service.getBlogComments().subscribe({
      next: (result: PagedResults<BlogComment>) => {
        this.blogComments = result.results;
      },
      error: () => {
      }
    });
  }

  toggleOptions(index: number) {
    if (this.showOptions === index) {
      this.showOptions = null;
    } else {
      this.showOptions = index;
    }
  }

  isOptionsVisible(index: number): boolean {
    return this.showOptions === index;
  }

  onEditClicked(blogComment: BlogComment): void {
    this.selectedBlogComment = blogComment;
    this.shouldRenderBlogCommentForm = true;
    this.shouldEdit = true;
  }

  deleteComment(id: number): void {
    const result = window.confirm('Are you sure you want to delete your comment?');
    if(result) {
      this.service.deleteBlogComment(id).subscribe({
        next: () => {
          this.getBlogComments();
          this.onEditingFinished(false);
        },
      })
    }
  }

  onEditingFinished(value: boolean): void {
    this.shouldEdit = value;
  }
}
