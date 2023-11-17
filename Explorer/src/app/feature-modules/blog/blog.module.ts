import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { BlogPostManagementComponent } from './blog-post-management/blog-post-management.component';
import { BlogPostFormComponent } from './blog-post-form/blog-post-form.component';
import { BlogCommentComponent } from './blog-comment/blog-comment.component';
import { BlogCommentFormComponent } from './blog-comment-form/blog-comment-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BlogPostTableComponent } from './blog-post-table/blog-post-table.component';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { FormsModule } from '@angular/forms';
    
@NgModule({
  declarations: [
    BlogPostManagementComponent,
    BlogPostFormComponent,
    BlogCommentComponent,
    BlogCommentFormComponent,
    BlogPostTableComponent,
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    FormsModule
  ],
  exports: [
    BlogPostManagementComponent,
    BlogPostFormComponent,
    BlogCommentComponent,
    BlogCommentFormComponent
  ]
})

export class BlogModule { }