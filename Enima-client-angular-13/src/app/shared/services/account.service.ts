import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAddress } from 'src/app/shared/models/address.model';
import { IUser, IUserLogin, IUserLoginResponse, IUserRegister } from 'src/app/shared/models/iuser.model';
 
 
import { environment } from 'src/environments/environment';
import { BaseHttpService } from '../api/base/base-http.service';
 
 
const API_USERS_NAME:string    = 'users/';
const API_LOGIN_NAME:string    = 'login';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BaseHttpService<IUser, string> {
 
  baseUrl =  `${environment.apiBaseServer.Accounts}`;

  httpOptions : any    = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*'
    })
  };

  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  users

 
  constructor(protected override _http: HttpClient, private router: Router) {
       super(_http, `${environment.apiBaseServer.Accounts}${environment.account.TableUsers}`);
  }
 

  
  get_O_CurrentUser() {
     return this.currentUser$;
  }


  loadCurrentUser(accessToken: string) {
    if (accessToken === null) {
        this.currentUserSource.next(null);
        return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${accessToken}`);

    return this._http.get(this.baseUrl + 'account', { headers }).pipe(
        map((user: IUser) => {
            if (user) {
                localStorage.setItem('accessToken', user.accessToken);
                this.currentUserSource.next(user);
            }
        })
    );
}


  login(values: IUserLogin) {
    return this._http.post(this.baseUrl + API_LOGIN_NAME,  values).pipe(
      map((user: IUserLoginResponse) => {
          if (user) {
              console.log(user );
              localStorage.setItem('accessToken', user.accessToken);
              localStorage.setItem('email', user.user.email);
              this.currentUserSource.next(user.user);
          }
      })
    );
  }



  register(values: IUserRegister) {
    values.role="User";
    values.lastName="default";
    values.firstName="default";
    console.log("Service register elm :  " + JSON.stringify(values));
    console.log("Service register elm :  " + this._Linkbase  );
    return this._http.post(this._Linkbase,  values).pipe(
      map((user: IUserLoginResponse) => {
          if (user) {
            console.log(user );
            localStorage.setItem('accessToken', user.accessToken);
            localStorage.setItem('email', user.user.email);
            this.currentUserSource.next(user.user);
             }
         })
      );
  }



  logout() {
    localStorage.removeItem('accessToken');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
 

  checkEmailExists(email: string) {
    return this._http.get(
        this._Linkbase + '/emailexists?email=' + email
    );
}

getUserAddress() {
  return this._http.get<IAddress>(this._Linkbase + '/address');
}

updateAddress(address: IAddress) {
  return this._http.put<IAddress>(
      this._Linkbase + '/address',
      address
  );
}
}
