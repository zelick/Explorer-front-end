import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BlogCommentComponent } from './blog-comment/blog-comment.component';
import { BlogCommentFormComponent } from './blog-comment-form/blog-comment-form.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    BlogCommentComponent,
    BlogCommentFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  exports: [
    BlogCommentFormComponent
  ]
})

export class BlogModule { }