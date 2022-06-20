import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../admin/shared/services/auth.service";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(this.auth.isAuthenticated()){
      req = req.clone({
        setParams: {
          auth: this.auth.token
        }
      })
    }
    // @ts-ignore
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse)=>{
          console.log('[Interceptor Error]: ', error)
          if(error.status === 401){
            this.auth.logout()
            this.router.navigate(['/admin', 'login'], {
              queryParams: {
                authFailed: true
              }
            })
          }
          return throwError(error)
        })
      )
    }

}
