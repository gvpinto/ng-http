import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './posts.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  url: string =
    'https://ng-complete-guide-b04f9-default-rtdb.firebaseio.com/posts.json';

  error = new Subject<string>();

  constructor(private http: HttpClient) {}
  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>(this.url, postData).subscribe(
      (responseData) => {
        console.log(responseData);
      },
      (error) => {
        this.error.next(error.message);
      }
    );
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>(this.url).pipe(
      // map((responseData: { [key: string]: Post }) => { // Alternate way
      map((responseData) => {
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      })
    );
  }

  deletePosts() {
    return this.http.delete(this.url);
  }
}
