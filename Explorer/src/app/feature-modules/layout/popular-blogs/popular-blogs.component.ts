import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogPost, BlogPostStatus } from '../../blog/model/blog-post.model';
import { Rating } from '../../blog/model/blog-rating.model';
import { LayoutService } from '../layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-popular-blogs',
  templateUrl: './popular-blogs.component.html',
  styleUrls: ['./popular-blogs.component.css']
})
export class PopularBlogsComponent implements OnInit, OnDestroy {
  blogs: BlogPost[] = [];
  i: number = 0;
  imageIntervals: Map<number, any> = new Map();
  imageIndexes: Map<number, number> = new Map();

  constructor(private service: LayoutService, private router: Router){

  }

  ngOnInit(): void {
    /*this.blogs = [
      {userId: 3, username: 'username', id:1, comments:[{userId:2, username:'tupan', text:'Odlican blog', creationTime: new Date(), }], title: 'Neki blog', description: 'Ovaj blog kida', creationDate: new Date(), status:BlogPostStatus.Famous ,ratings : [{userId:1, rating:Rating.Upvote},{userId:2, rating:Rating.Downvote}], imageNames:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR94u0EyhIYQ35WVzV0LSlxZ0Ozv9tMqfzewA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG3PlQB2yqO1_AmQSR8bgcczzjpOLQ8cy2A&usqp=CAU']},
      {userId: 3, username: 'username', id:1, comments:[{userId:2, username:'tupan', text:'Odlican blog', creationTime: new Date(), }], title: 'Neki blog', description: 'Ovaj blog kida', creationDate: new Date(), status:BlogPostStatus.Active ,ratings : [{userId:1, rating:Rating.Upvote},{userId:2, rating:Rating.Downvote}], imageNames:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR94u0EyhIYQ35WVzV0LSlxZ0Ozv9tMqfzewA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG3PlQB2yqO1_AmQSR8bgcczzjpOLQ8cy2A&usqp=CAU']},
      {userId: 3, username: 'username', id:1, comments:[{userId:2, username:'tupan', text:'Odlican blog', creationTime: new Date(), }], title: 'Neki blog', description: 'Ovaj blog kida', creationDate: new Date(), status:BlogPostStatus.Famous ,ratings : [{userId:1, rating:Rating.Upvote},{userId:2, rating:Rating.Downvote}], imageNames:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR94u0EyhIYQ35WVzV0LSlxZ0Ozv9tMqfzewA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG3PlQB2yqO1_AmQSR8bgcczzjpOLQ8cy2A&usqp=CAU']},
      {userId: 3, username: 'username', id:1, comments:[{userId:2, username:'tupan', text:'Odlican blog', creationTime: new Date(), }], title: 'Neki blog', description: 'Ovaj blog kida', creationDate: new Date(), status:BlogPostStatus.Published ,ratings : [{userId:1, rating:Rating.Upvote},{userId:2, rating:Rating.Downvote}], imageNames:['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR94u0EyhIYQ35WVzV0LSlxZ0Ozv9tMqfzewA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGG3PlQB2yqO1_AmQSR8bgcczzjpOLQ8cy2A&usqp=CAU']}
    ]*/
    this.service.getTopRatedBlogs(4).subscribe({
      next: (result: BlogPost[]) => {
       this.blogs = result;
       this.getImagePaths();
       console.log(this.blogs);
      },
      error: () => {
          console.log('Nesupesno dobavljanje blogova');
      }
    });

  }
  getUpvoteCount(blog: BlogPost): number {
      return blog.ratings ? blog.ratings.filter(rating => rating.rating === Rating.Upvote).length : 0;
  }

  getDownvoteCount(blog: BlogPost): number {
      return blog.ratings ? blog.ratings.filter(rating => rating.rating === Rating.Downvote).length : 0;
  }
  get thumbsUpEmoji(): string {
    return '\u{1F44D}';
  }
  routeToBlog(blog:BlogPost){
    if(blog.id){
      this.router.navigate(['/blogs', blog.id]);
    }
  }
  getImagePaths() {
    const baseUrl: string = "https://localhost:44333//images/";
    this.blogs.forEach(blog => {
      if (blog.imageNames && blog.imageNames.length > 0) {
        blog.imageNames = blog.imageNames.map(imageName => baseUrl + imageName);
      }
    });
  }
  get thumbsDownEmoji(): string {
    return '\u{1F44E}';
  }
  ngOnDestroy(): void {
    this.imageIntervals.forEach((interval) => {
      clearInterval(interval);
    });
  }
  startImageInterval(cardId: number, images: string[]): void {
    this.imageIntervals.set(cardId, setInterval(() => {
      const currentIndex = this.imageIndexes.get(cardId) || 0;
      const nextIndex = (currentIndex + 1) % images.length;
      const currentImg = document.getElementById(`img-${cardId}-current`) as HTMLImageElement;
  
      if (currentImg) {
        currentImg.src = images[nextIndex];
      }
  
      this.imageIndexes.set(cardId, nextIndex);
    }, 2500));
  }
  stopImageInterval(cardId: number): void {
    const interval = this.imageIntervals.get(cardId);
    if (interval) {
      clearInterval(interval);
    }
    this.imageIntervals.delete(cardId);
    this.imageIndexes.delete(cardId);
  }
}
