import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogComment } from './model/blogComment.model';
import { BlogPost, BlogPostStatus } from './model/blog-post.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  constructor(private http: HttpClient, private authService: AuthService) { }

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

  addBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(environment.apiHost + 'blogging/blog-posts', blogPost);
  }

  deleteBlogPost(id: number): Observable<BlogPost> {
    return this.http.delete<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}`);
  }

  updateBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    return this.http.put<BlogPost>(environment.apiHost + `blogging/blog-posts/${blogPost.id}`, blogPost);
  }

  closeBlog(id: number): Observable<BlogPost> {
    return this.http.patch<BlogPost>(environment.apiHost + `blogging/blog-posts/${id}/close`, null);
  }
  
    addBlogComment(blogComment: BlogComment): Observable<BlogComment> {
    return this.http.post<BlogComment>(environment.apiHost + 'blogging/blog-comment/', blogComment);
  }

  getBlogComments(): Observable<PagedResults<BlogComment>> {
    return this.http.get<PagedResults<BlogComment>>(environment.apiHost + 'blogging/blog-comment/')
  }

  deleteBlogComment(id: number): Observable<BlogComment> {
    return this.http.delete<BlogComment>(environment.apiHost + 'blogging/blog-comment/' + id);
  }

  updateBlogComment(blogComment: BlogComment): Observable<BlogComment> {
    return this.http.put<BlogComment>(environment.apiHost + 'blogging/blog-comment/' + blogComment.id, blogComment);
  }
}
