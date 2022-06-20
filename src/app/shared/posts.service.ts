import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {FbCreateResponse, Post} from "./interfaces";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient) {
  }
  create(post:Post):Observable<Post>{
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      // @ts-ignore
      .pipe(map((response: FbCreateResponse)=>{
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        }
      }))
  }
  getAll(): Observable<Post[]>{
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(map((response: {[key: string]: any})=>{
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }))
      }))
  }
  remove(id: string): Observable<void>{
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
  }
}
