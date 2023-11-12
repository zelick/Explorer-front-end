import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogPost, BlogPostStatus } from '../model/blog-post.model';
import { BlogService } from '../blog.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { ImageService } from 'src/app/shared/image/image.service';

@Component({
  selector: 'xp-blog-post-form',
  templateUrl: './blog-post-form.component.html',
  styleUrls: ['./blog-post-form.component.css']
})
export class BlogPostFormComponent implements OnChanges {

  @Output() blogPostUpdated = new EventEmitter<null>();
  @Input() blogPost: BlogPost;
  @Input() shouldEdit: boolean = false;

  public BlogPostStatus = BlogPostStatus;
  userId: number;
  imagePreview: string[] = [];

  constructor(private service: BlogService, authService: AuthService, private imageService: ImageService) {
    this.userId = authService.user$.value.id;
  }

  ngOnChanges(): void {
    this.blogPostForm.reset();

    if (this.shouldEdit) {
      this.blogPostForm.patchValue({
        title: this.blogPost.title,
        description: this.blogPost.description,
      });
      this.imagePreview = this.blogPost.imageNames?.map(imageName => this.getImageUrl(imageName)) || [];
    } else {
      this.imagePreview = [];
    }
  }

  blogPostForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    images: new FormControl(''),
  });

  addBlogPost(blogPostStatus: BlogPostStatus): void {
    const formData = new FormData();

    const blogPost = this.fillForm(blogPostStatus);
    this.fillFormData(formData, blogPost);
    this.fillImages(formData);

    this.service.addBlogPost(formData).subscribe({
      next: () => {
        this.blogPostUpdated.emit();
        this.blogPostForm.reset();
        this.imagePreview = [];
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });

  }
  
  updateBlogPost(blogPostStatus: BlogPostStatus): void {
    const formData = new FormData();
    
    const blogPost = this.fillForm(blogPostStatus);
    this.fillFormData(formData, blogPost);
    this.fillImages(formData);

    this.service.updateBlogPost(this.blogPost.id!, formData).subscribe({
      next: () => {
        this.blogPostUpdated.emit();
        this.blogPostForm.reset();
        this.imagePreview = [];
      },
      error: (err) => {
        console.error('Update failed:', err);
      },
    });

  }
  
  private fillImages(formData: FormData) {
    if (this.blogPostForm.value.images) {
      const selectedFiles = this.blogPostForm.value.images;
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }
    }
  }

  private fillForm(blogPostStatus: BlogPostStatus) {
    const currentDateTime = new Date();
    const blogPost: BlogPost = {
      userId: this.userId,
      title: this.blogPostForm.value.title as string || '',
      description: this.blogPostForm.value.description as string || '',
      creationDate: currentDateTime,
      status: blogPostStatus
    };
    return blogPost;
  }
  
  private fillFormData(formData: FormData, blogPost: BlogPost) {
    formData.append('title', blogPost.title);
    formData.append('description', blogPost.description);
    formData.append('userId', blogPost.userId!.toString());
    formData.append('creationDate', blogPost.creationDate.toISOString());
    formData.append('status', blogPost.status);
  }

  onImageSelected(event: any): void {
    const selectedFiles = event?.target?.files;

    if (selectedFiles && selectedFiles.length > 0) {
      this.imagePreview = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imagePreview.push(e.target?.result as string);
        };

        reader.readAsDataURL(selectedFiles[i]);
      }
    }
    this.blogPostForm.get('images')?.setValue(selectedFiles);
  }
  
  getImageUrl(imageName: string): string {
    return this.imageService.getImageUrl(imageName);
  }
}
