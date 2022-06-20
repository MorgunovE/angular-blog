import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FBAuthResponse, User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>()

  constructor(private http: HttpClient) {}

  get token():string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'))
    if(new Date() > expDate){
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user).pipe(
      // @ts-ignore
      tap(this.setToken),
      // @ts-ignore
      catchError(this.handleError.bind(this))
    )
  }

  logout(){
    this.setToken(null)
  }

  isAuthenticated():boolean{
    return !!this.token
  }

  private handleError(error: HttpErrorResponse){
    const {message} = error.error.error

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password')
        break
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found')
        break
    }

    return throwError(error)
  }

  private setToken(res: FBAuthResponse | null) {
    if(res){
      const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000)
      localStorage.setItem('fb-token', res.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }

}
