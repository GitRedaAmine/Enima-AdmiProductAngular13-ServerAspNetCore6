import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from 'src/app/shared/models/api/ibrand.model';
import { environment } from 'src/environments/environment';
import { BaseHttpService } from './base/base-http.service';
 
 
@Injectable({
  providedIn: 'root'
})
export class BrandService extends BaseHttpService<IBrand, string> {


  constructor(protected override _http: HttpClient) {
    super(_http, `${environment.apiBaseServer.Products}${environment.product.TableBrand}`);
  }
}
