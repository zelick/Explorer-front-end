import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BlogComment } from '../model/blog-comment.model';
import { BlogService } from '../blog.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.css']
})

export class BlogCommentComponent implements OnInit {

  @Input() blogPostId: number | undefined;
  @Input() comment: BlogComment;
  @Output() commentUpdated: EventEmitter<void> = new EventEmitter<void>();
  showOptions: boolean = false;
  userId: number;
  isEditing = false;
  editedCommentText: string = '';

  constructor(private service: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.user$.value.id;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  isOptionsVisible(): boolean {
    return this.showOptions;
  }

  deleteComment(): void {
    const result = window.confirm('Are you sure you want to delete your comment?');
    if(result) {
      this.service.deleteBlogComment(this.blogPostId!, this.comment).subscribe({
        next: () => {
          this.showOptions = false;
          this.commentUpdated.emit();
        },
      })
    }
  }

  onEditClicked() {
    this.isEditing = true;
    this.editedCommentText = this.comment.text;
    this.showOptions = false;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedCommentText = this.comment.text;
  }

  editCommment() {
    this.comment.text = this.editedCommentText;
    this.isEditing = false;
    this.service.addBlogComment(this.blogPostId!, this.comment).subscribe({
      next: () => {
        this.commentUpdated.emit();
      }
    })
  }
}
