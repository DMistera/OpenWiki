import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import { environment } from '@environments/environment';

import { User } from '@app/models';
import { Router } from '@angular/router';

const HTTP_OPTIONS2 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }),
  observe: 'response' as const
};

const HTTP_OPTIONS3 = {
  headers: new HttpHeaders({
    'Accept': '*/*'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User|null>;
  public user: Observable<User|null>;

  public userLoggedIn: boolean;

  constructor(private router: Router, private http: HttpClient){
    this.userLoggedIn = false;
    this.userSubject = new BehaviorSubject<User|null>(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
    this.userLoggedIn = this.isUserLoggedIn;
  }

  public get isUserLoggedIn(): boolean {
    // let v;
    // this.user.subscribe(x => {
    //   console.log(x);
    //   if(x==null){
    //     v = false;
    //   }else{
    //     v = true;
    //   }
    // }).unsubscribe();
    // console.log("isLoggedIn");
    // console.log(v);
    return this.user!=null;
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    // console.log(new HttpErrorResponse(JSON.parse('{"status":401,"error":[{"key":"IsNotAllowed","message":"Email confirmation required"}]}')))
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }

  login(userName: string, password: string) {
    var user = {"userName": userName, "password": password};

    return this.http.post<any>(`/api/User/Login`, user, HTTP_OPTIONS2)
      .pipe(
        map(data => {
        console.log("Login status code:", data.status)
        if(data.status == 200){
          this.userLoggedIn = true;
          return this.userInfo().subscribe(
            data => {
              console.log("userData: ");
              console.log(data.body);
              var tempUser = new User(data.body);
              localStorage.setItem('user',  JSON.stringify(tempUser));
              this.userSubject.next(tempUser);
            },
            err => {
              console.log(err);
              var tempUser = new User({ "userName": userName });
              localStorage.setItem('user',  JSON.stringify(tempUser));
              this.userSubject.next(tempUser);
            }
          );
        }
        if(data.status == 400){
          console.log(data);
        }
        return data;
      })
    );
  }

  register(userName: string, email: string, password: string) {
    var user = {"userName": userName, "email": email, "password": password};
    console.log(user)
    return this.http.post<any>('/api/User/Register', user, HTTP_OPTIONS2)
    .pipe(map(data => {
      console.log("Register status code:", data.status)
      console.log("Register", data)
      return data;
    }));
  }


  userInfo() {
    return this.http.get<any>(`/api/User/`, { observe: 'response'}).pipe(map(data => {
      console.log("UserInfo status code:", data.status)
      if(data.status == 200){
        this.userLoggedIn = true;
      }
      else{
        this.userLoggedIn = false;
      }
      return data;
    }));
  }

  logout() {
    return this.http.delete<any>('/api/User/Logout', HTTP_OPTIONS2).pipe(map(data => {
      console.log(data);
      localStorage.removeItem('user');
      this.userSubject.next(null);
      this.userLoggedIn = false;
      return data;
    }));
  }
}
