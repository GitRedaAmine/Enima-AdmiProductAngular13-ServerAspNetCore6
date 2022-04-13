import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
import { environment } from 'src/environments/environment';
import { IImageUrl } from '../../models/api/iproduct.model';
import { DataHttpService } from './base/data-http.service';
 
 
 
@Injectable({
  providedIn: 'root'
})
export class ImageUrlService extends DataHttpService<IImageUrl, string> {

 
 
 
  constructor(protected override _http: HttpClient) {
    super(_http, `${environment.apiBaseServer.Products}${environment.product.TableImageUrl}`);

  }

  

   getImagesByProductId(uuid :string ):  Observable<IImageUrl[]>
   {
 
    return this._http.get<IImageUrl[]>( this._Linkbase + "/getAllByProductId/" +uuid  );

   }
 
}

