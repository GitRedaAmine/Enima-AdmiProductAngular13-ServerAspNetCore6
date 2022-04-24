import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, of, switchMap, timer } from 'rxjs';
import { SignupRequest } from 'src/app/requests/signup-request';
import { SignupResponse } from 'src/app/responses/error-response';
import { UserService } from 'src/app/services/user.service';
 

 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  hide = true;
  loading = false;
  // Roles: any = ['Admin', 'Author', 'Reader'];
  returnUrl!: string;
  submitted = false;


  signupRequest: SignupRequest = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    ts: new Date().toISOString()
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/login';
    this.createregisterForm(); 
  }

  createregisterForm() {
    this.registerForm = new FormGroup({
      email: new FormControl('reda_amine@enimashoping.com', [Validators.required, Validators.email]),
      password: new FormControl('reda_amine@2022', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('reda_amine@2022', [Validators.required, Validators.minLength(8)]),
      firstName: new FormControl('reda'   ),
      lastName: new FormControl('amine'   ),
    });
  }

  SubmitRegister(): void {

    this.submitted = true;
    console.log("registerComponent : call  SubmitLogin ");
    if (this.registerForm.invalid) {
      return;
    } 

    this.signupRequest.email= this.registerForm.controls["email"].value; 
    this.signupRequest.password= this.registerForm.controls["password"].value;
    this.signupRequest.confirmPassword= this.registerForm.controls["confirmPassword"].value; 
    this.signupRequest.firstName= this.registerForm.controls["firstName"].value;
    this.signupRequest.lastName= this.registerForm.controls["lastName"].value;
    this.loading=true;

    console.log(JSON.stringify(this.signupRequest));

    this.userService.signup(this.signupRequest)
    .subscribe({
        next: data => {
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;

          this.toastr.success("register user  success", "Info");
         
          this.router.navigateByUrl(this.returnUrl);
          this.loading=false;

        },
        error: err => {
          this.loading=false;
          console.log(err);
          let resp: SignupResponse = JSON.parse(err);
          this.isSignUpFailed = true;
          this.toastr.error(  resp.error, "Error code " + resp.errorCode    );
        }
      });
  }

 





  get f(){
    return this.registerForm.controls;
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerForm.controls[controlName].hasError(errorName);
  }

 


  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
 
}
