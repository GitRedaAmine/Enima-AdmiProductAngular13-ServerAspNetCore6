import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminModule } from './admin/admin.module';
import { HttpClientModule } from '@angular/common/http';
 
import { ToastrModule } from 'ngx-toastr';
 
 
import { BlockUIModule } from 'ng-block-ui';
 
import { MaterialModule } from './shared/modules/material/material.module';
 
 
 
import { FormsModule } from '@angular/forms';
import { AuthInterceptorProvider } from './interceptors/auth.interceptor';
import { ErrorInterceptorProvider } from './interceptors/error.interceptor';
 
@NgModule({
  declarations: [
    AppComponent,
 
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AdminModule,
    FormsModule,
    BlockUIModule.forRoot(),
    ToastrModule.forRoot({
      maxOpened:10,
      timeOut: 2000,
      closeButton:true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
  }),
  ],
  providers: [
    AuthInterceptorProvider,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ]
})
export class AppModule { }
