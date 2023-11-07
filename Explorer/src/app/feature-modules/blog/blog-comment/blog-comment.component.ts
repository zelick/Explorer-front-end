import { Component, OnInit, Input } from '@angular/core';
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
  blogComments: BlogComment[] = [];
  selectedBlogComment: BlogComment;
  shouldRenderBlogCommentForm: boolean = false;
  shouldEdit: boolean = false;
  showOptions: boolean = false;
  userId: number;

  constructor(private service: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.userId = this.authService.user$.value.id;
    console.log('HELO iz koemntara');
    console.log(this.comment);
    console.log(this.blogPostId);
  }


  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  isOptionsVisible(): boolean {
    return this.showOptions;
  }

  onEditClicked(): void {
    this.shouldRenderBlogCommentForm = true;
    this.shouldEdit = true;
  }

  // TODO
  // updateBlogComment(): void {
  //   const blogComment: BlogComment = {
  //     userId: this.blogComment.userId,
  //     creationTime: this.blogComment.creationTime,
  //     modificationTime: new Date(),
  //     text: this.blogCommentForm.value.text || ""
  //   }
  // }

  deleteComment(): void {
    const result = window.confirm('Are you sure you want to delete your comment?');
    if(result) {
      this.service.deleteBlogComment(this.blogPostId!, this.comment).subscribe({
        next: () => {
          this.onEditingFinished(false);
        },
      })
    }
  }

  onEditingFinished(value: boolean): void {
    this.shouldEdit = value;
  }
}
