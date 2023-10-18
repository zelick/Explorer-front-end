import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { BlogComment } from './model/blogComment.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

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