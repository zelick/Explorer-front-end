import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { BlogComment } from '../model/blogComment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.css']
})
export class BlogCommentFormComponent implements OnChanges{
  
  @Output() blogCommentsUpdated = new EventEmitter<null>();
  @Input() blogComment: BlogComment;
  @Input() blogPostId: number | undefined;
  @Input() shouldEdit: boolean = false;
  @Output() editingFinished = new EventEmitter<boolean>();

  userId: number;

  constructor(private service: BlogService, private authService: AuthService) {
    this.userId = authService.user$.value.id;
  }

  ngOnChanges(): void {
    this.blogCommentForm.reset();
    if(this.shouldEdit) {
      this.blogCommentForm.patchValue({
        text: this.blogComment.text
      })
    }
  }

  blogCommentForm = new FormGroup({
    text: new FormControl('', [Validators.required])
  });

  addComment(): void {
    const blogComment: BlogComment =  {
      blogPostId: this.blogPostId , 
      userId: this.userId,
      creationTime: new Date(),
      text: this.blogCommentForm.value.text || ""
    }

    this.service.addBlogComment(blogComment).subscribe({
      next: () => {
        this.blogCommentsUpdated.emit()
        this.blogCommentForm.reset();
      }
    })
  }

  updateBlogComment(): void {
    const blogComment: BlogComment =  {
      blogPostId: this.blogComment.blogPostId, 
      userId: this.blogComment.userId,
      creationTime: this.blogComment.creationTime,
      modificationTime: new Date(),
      text: this.blogCommentForm.value.text || ""
    }
    blogComment.id = this.blogComment.id;

    this.service.updateBlogComment(blogComment).subscribe({
      next: () => {
        this.blogCommentsUpdated.emit()
        this.blogCommentForm.reset();
        this.editingFinished.emit(false);
      }
    })
  }
}
