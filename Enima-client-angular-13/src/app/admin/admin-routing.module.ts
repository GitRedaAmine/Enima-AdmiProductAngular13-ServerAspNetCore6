import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin.component';
 
import { AddComponent } from './components/products/page/add/add.component';
 
import { DelComponent } from './components/products/page/del/del.component';
import { EditComponent } from './components/products/page/edit/edit.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [

    { path: '', component:ProductsComponent},
  { path: 'products', component:ProductsComponent},

  { path: 'products/add', component:AddComponent},
  { path: 'products/edit/:uuid', component:EditComponent},
  { path: 'products/del/:uuid', component:DelComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
