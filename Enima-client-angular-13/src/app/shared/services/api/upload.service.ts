import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFileDelReq, IFileUploadReq } from '../../models/api/iproduct.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  baseUrl=`${environment.apiBaseServer.Products}File/`
  constructor(protected _http: HttpClient) { }

 
  uploadFireBase( upload:IFileUploadReq)  {

      var formData: any = new FormData();
      formData.append('folderName', upload.folderName);
      formData.append('fileName', upload.fileName);
      formData.append('file',upload.file );
      return  this._http.post<any>(this.baseUrl+ 'uploadFireBase'  , formData,{
          reportProgress: true,
          observe: 'events'
        })  
  }
  
  uploadLocal(  upload:IFileUploadReq )  {
 
    var formData: any = new FormData();
    formData.append('folderName', upload.folderName);
    formData.append('fileName', upload.fileName);
    formData.append('file',upload.file );
    return  this._http.post<any>(this.baseUrl+ 'uploadLocal'  , formData,{
        reportProgress: true,
        observe: 'events'
      })  
  }

  deleteFireBase( upload:IFileDelReq)  {
   const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: upload
  };
  
   return  this._http.delete<any>(this.baseUrl+ 'deleteFireBase'  , options) ;
}

deleteLocal(  upload:IFileDelReq )  {

  const options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: upload
  };
  return  this._http.delete<any>(this.baseUrl+ 'deleteLocal'  , options)  
}




}
