import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ProductsComponent } from './components/products/products.component';
import { AddComponent } from './components/products/page/add/add.component';
import { DelComponent } from './components/products/page/del/del.component';
 
 
import { MaterialModule } from '../shared/modules/material/material.module';
import { HttpClientModule } from '@angular/common/http';
 
import { FilePickerDirective } from './directives/file-picker.directive';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './components/admin.component';
import { BlockUIModule } from 'ng-block-ui';

import { BrandsComponent } from '../shared/components/brands/brands.component';
import { CategoriesComponent } from '../shared/components/categories/categories.component';
import { EditComponent } from './components/products/page/edit/edit.component';
import { UsersComponent } from './components/users/users.component';

@NgModule({
  declarations: [
    ProductsComponent,
    AddComponent,
    DelComponent,
    EditComponent,
 
    AdminComponent,
    FilePickerDirective,
    BrandsComponent,
    CategoriesComponent,
    UsersComponent,
   
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    BlockUIModule.forRoot(),
  ],
  exports:[
    AdminComponent
  ]
})
export class AdminModule { }
