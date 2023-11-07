import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { BlogComment } from '../model/blog-comment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.css']
})
export class BlogCommentFormComponent{
  
  @Input() blogComment: BlogComment;
  @Input() blogPostId: number | undefined;
  @Output() commentAdded: EventEmitter<void> = new EventEmitter<void>();

  userId: number;

  constructor(private service: BlogService, private authService: AuthService) {
    this.userId = authService.user$.value.id;
  }

  blogCommentForm = new FormGroup({
    text: new FormControl('', [Validators.required])
  });

  addComment(): void {
    const blogComment: BlogComment =  {
      userId: this.userId,
      creationTime: new Date(),
      text: this.blogCommentForm.value.text || ""
    }

    this.service.addBlogComment(this.blogPostId!, blogComment).subscribe({
      next: () => {
        this.commentAdded.emit();
        this.blogCommentForm.reset();
      }
    })
  }
}
