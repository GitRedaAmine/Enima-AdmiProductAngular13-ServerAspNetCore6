import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, observable } from 'rxjs';
import { UserResponse } from './responses/user-response';
 
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
 
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'E-shop-enima';
  isLoggedIn = false;
 

  user: UserResponse = {
    email: '',
    firstName: '',
    lastName: '',
    creationDate: new Date()
  }

  
  constructor(private tokenService: TokenService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.tokenService.isLoggedIn();
  
    this.userService.getUserInfo().subscribe(
      {
        next: (data => {
          this.user = data;
        }),
        error: (() => {
          console.log('failed to get the use info');
        })
      }

    );
    
  }

  logout(): void {
    this.tokenService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['login']);
    return;
  }

 

 
 
}
