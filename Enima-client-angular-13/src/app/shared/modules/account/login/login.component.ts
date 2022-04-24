import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from 'src/app/requests/login-request';
import { ErrorResponse, SignupResponse } from 'src/app/responses/error-response';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  hide = true;
  returnUrl!: string;
  loading = false;

  isLoggedIn = false;
  isLoginFailed = false;
  error: ErrorResponse = { error: '', errorCode: "0" };

  loginRequest: LoginRequest = {
    email: 'reda_amine@enimashoping.com',
    password: 'reda_amine@2022'
  };
 
  constructor(private userService: UserService,    
    private toastr: ToastrService,
   private tokenService: TokenService, 
   private router: Router,
   private activatedRoute: ActivatedRoute) { }


   ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/login';

    this.createLoginForm();
    let isLoggedIn = this.tokenService.isLoggedIn();
    console.log(`isLoggedIn: ${isLoggedIn}`);
    if (isLoggedIn) {
      this.isLoggedIn = true;

      this.router.navigate(['/admin']);
    }
  }

  
  SubmitLogin(): void {
    if (this.loginForm.invalid) {
     this.toastr.error("login form is invalid", "Error");
      return;
    } 

    this.loginRequest.email= this.loginForm.controls["email"].value; 
    this.loginRequest.password= this.loginForm.controls["password"].value;

 
 
   this.userService.login(this.loginRequest).subscribe({
     next: (data => {
      
       this.tokenService.saveSession(data);
       this.isLoggedIn = true;
       this.isLoginFailed = false;
       this.reloadPage();
       this.router.navigateByUrl(this.returnUrl);
     }),
     error: ((err :ErrorResponse) => {
       let resp: ErrorResponse =err ;
       this.error = resp;
       this.isLoggedIn = false;
       this.isLoginFailed = true;
       console.log( resp);
       this.toastr.error(  resp.error, "Error : " +  resp.errorCode)
     })

   });
 }
 reloadPage(): void {
   window.location.reload();
 }
 

  createLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('reda_amine@enimashoping.com', [Validators.required, Validators.email]),
      password: new FormControl('reda_amine@2022', [Validators.required, Validators.minLength(8)])
    });
  }


 

  get f(){
    return this.loginForm.controls;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }
 
 
 
 




}
