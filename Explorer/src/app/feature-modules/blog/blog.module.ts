import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPostComponent } from './blog-post/blog-post.component';
import { BlogPostFormComponent } from './blog-post-form/blog-post-form.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    BlogPostComponent,
    BlogPostFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    BlogPostComponent,
    BlogPostFormComponent
  ]
})
export class BlogModule { }
