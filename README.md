
### project 
This simple project is for learning how to use storage firebase of google.
- admin module is used for add a new product / update an existing product / delete a product.
- client module is used to display products.

### how to use  
#### backend server : net core 6 api web
    - open the net core 6 project : Enima-server-net-6
	- edite appsettings.json :
           	1- update information of your firebase storage  keys
				"ApiKey": "xxx",
				"Bucket": "xxx",
            2- update information of your firebase auth ( use mail and pwd) 
				"AuthEmail": "xxx@xxxxx",
				"AuthPassword": "xxxxxx",
			3-save
    - compile and  run 			

#### frontend  angular 13 app 
    run : ng serve 

### dependencies angular client app
 
    "@angular/animations": "~13.2.1",
    "@angular/cdk": "^13.2.5",
    "@angular/common": "~13.2.1",
    "@angular/compiler": "~13.2.1",
    "@angular/core": "~13.2.1",
    "@angular/flex-layout": "^13.0.0-beta.38",
    "@angular/forms": "~13.2.1",
    "@angular/material": "^13.2.1",
    "@angular/platform-browser": "~13.2.1",
    "@angular/platform-browser-dynamic": "~13.2.1",
    "@angular/router": "~13.2.1",
    "angular-material-icons": "^0.7.1",
    "ng-block-ui": "^3.0.2",
    "ngx-toastr": "^14.2.2",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "uikit": "^3.13.5",
    "uuid": "^8.3.2",
    "zone.js": "~0.11.4"
 
# Editor.md

![](https://firebasestorage.googleapis.com/v0/b/rtdb-5ec40.appspot.com/o/logo%2F2393641cd32b4eb4bb7bf7e22574f240.png?alt=media&token=b12da153-3ba9-45a1-9c6d-1aeefa17e036)
 
 
 


# EShopEnima

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
###End