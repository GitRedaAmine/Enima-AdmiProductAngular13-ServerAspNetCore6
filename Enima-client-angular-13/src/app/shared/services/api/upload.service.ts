import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFileDelReq, IFileAddReq, IFileUpdateReq } from '../../models/api/iproduct.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  baseUrl=`${environment.apiBaseServer.Products}File/`
  constructor(protected _http: HttpClient) { }

 
  addNew( upload:IFileAddReq)  {

      var formData: any = new FormData();
      formData.append('folderName', upload.folderName);
      formData.append('file',upload.file );
      return  this._http.post<any>(this.baseUrl+ 'add'  , formData,{
          reportProgress: true,
          observe: 'events'
        })  
  }
  
 
  update( upload:IFileUpdateReq)  {

    var formData: any = new FormData();
    formData.append('folderName', upload.folderName);
    formData.append('fileName', upload.fileName);
    formData.append('file',upload.file );
    return  this._http.post<any>(this.baseUrl+ 'update'  , formData,{
        reportProgress: true,
        observe: 'events'
      })  
}

  del( upload:IFileDelReq)  {
   const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: upload
  };
  
   return  this._http.delete<any>(this.baseUrl+ 'delete'  , options) ;
}

 
}
