import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategorie } from 'src/app/shared/models/api/icategorie.model';
import { environment } from 'src/environments/environment';
import { DataHttpService } from './base/data-http.service';
 
 
 
@Injectable({
  providedIn: 'root'
})
export class CategorieService extends DataHttpService<ICategorie, string> {

 
 
 
  constructor(protected override _http: HttpClient) {
    super(_http, `${environment.apiBaseServer.Products}${environment.product.TableCategorie}`);

  }
}

