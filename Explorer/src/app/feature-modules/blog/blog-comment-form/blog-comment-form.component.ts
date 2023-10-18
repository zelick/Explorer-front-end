import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { BlogComment } from '../model/blogComment.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-blog-comment-form',
  templateUrl: './blog-comment-form.component.html',
  styleUrls: ['./blog-comment-form.component.css']
})
export class BlogCommentFormComponent implements OnChanges{
  
  @Output() blogCommentsUpdated = new EventEmitter<null>();
  @Input() blogComment: BlogComment;
  @Input() shouldEdit: boolean = false;
  user: User;

  constructor(private service: BlogService, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
   }

  ngOnChanges(): void {
    if(this.shouldEdit) {
      this.blogCommentForm.patchValue(this.blogComment);
    }
  }

  blogCommentForm = new FormGroup({
    text: new FormControl('', [Validators.required])
  });

  addComment(): void {
    const creationTime = this.getCurrentTime();
    const blogComment: BlogComment =  {
      blogPostId: 0, 
      userId: this.user.id,
      creationTime: creationTime,
      modificationTime: "00:00:00",
      text: this.blogCommentForm.value.text || ""
    }

    this.service.addBlogComment(blogComment).subscribe({
      next: (_) => {
        this.blogCommentsUpdated.emit()
      }
    })
  }

  updateBlogComment(): void {
    const modificationTime = this.getCurrentTime();

    const blogComment: BlogComment =  {
      blogPostId: this.blogComment.blogPostId, 
      userId: this.blogComment.userId,
      creationTime: this.blogComment.creationTime,
      modificationTime: modificationTime,
      text: this.blogCommentForm.value.text || ""
    }
    blogComment.id = this.blogComment.id;

    this.service.updateBlogComment(blogComment).subscribe({
      next: (_) => {
        this.blogCommentsUpdated.emit()
      }
    })
  }

  getCurrentTime(): string {
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours().toString().padStart(2, '0');
    const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentDateTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
