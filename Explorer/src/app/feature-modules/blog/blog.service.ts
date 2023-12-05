import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogComment } from './model/blog-comment.model';
import { BlogPost, BlogPostStatus } from './model/blog-post.model';
import { BlogRating } from './model/blog-rating.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { PrivateTour } from '../tour-authoring/model/private-tour.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

  getPrivateTour(id: number): Observable<PrivateTour> {
    return this.http.get<PrivateTour>(environment.apiHost + 'tourist/privateTours/tour/' + id);
  }

  getPrivateTours(): Observable<PrivateTour[]> {
    return this.http.get<PrivateTour[]>(environment.apiHost + 'tourist/privateTours');
  }

  createPrivateTourBlog(tour: PrivateTour) {
    return this.http.put<PrivateTour>(environment.apiHost + 'tourist/privateTours/create-blog/', tour);
  }

  getBlogPosts(page: number, pageSize: number, status?: BlogPostStatus): Observable<PagedResults<BlogPost>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this.http.get<PagedResults<BlogPost>>(environment.apiHost + `blogging/blog-posts`, { params });
  }

  getBlogPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}`)
  }

  getBlogPostsByUser(userId: number): Observable<PagedResults<BlogPost>> {
    return this.http.get<PagedResults<BlogPost>>(environment.apiHost + `blogging/blog-posts/user/${userId}`)
  }

  addBlogPost(blogPost: FormData): Observable<BlogPost> {
    return this.http.post<BlogPost>(environment.apiHost + 'blogging/blog-posts', blogPost);
  }

  deleteBlogPost(id: number): Observable<BlogPost> {
    return this.http.delete<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}`);
  }

  updateBlogPost(id: number, blogPost: FormData): Observable<BlogPost> {
    return this.http.put<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}`, blogPost);
  }

  closeBlog(id: number): Observable<BlogPost> {
    return this.http.patch<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}/close`, null);
  }

  rateBlogPost(id: number, blogRating: BlogRating): Observable<BlogPost> {
    return this.http.put<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}/ratings`, blogRating);
  }
  
  addBlogComment(id: number, blogComment: BlogComment): Observable<BlogComment> {
    return this.http.patch<BlogComment>(environment.apiHost + `blogging/blog-posts/${id}/comments`, blogComment);
  }

  deleteBlogComment(id: number, blogComment: BlogComment): Observable<BlogComment> {
    return this.http.patch<BlogComment>(environment.apiHost + `blogging/blog-posts/${id}/comments/remove`, blogComment);
  }
}
