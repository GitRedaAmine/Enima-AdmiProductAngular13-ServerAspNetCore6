 
import { Subject } from "rxjs";
import { IImage, IImageUrl } from "src/app/shared/models/api/iproduct.model";

 

export enum EnuUploadSts
{
    WAIT_START,
    START_UPLOAD,
    UPLOADED_WAIt_FIREBASE,
    UPLOADED_FIREBASE,
}


export interface IUploadAdd  {
  percentage ?: number,
  src ?:string ,//| ArrayBuffer | null,
  file:File;
  isUploadedToFirebase :boolean,
  isUploaded  :boolean,
  isStartUploading:boolean,
  msg?:string,
  state:  EnuUploadSts,
}

export interface IUploadPut extends  IUploadAdd {
  uuid :string  ,
  name:string,
  isToDeleted? :boolean,
  isChanged? :boolean,
  isNew?:boolean,
  isFromProduct?:boolean,
  id:number,
}

 
export interface IDeleteInfo   {
  image ?    :IImage  ;
  isDeleted ?:boolean;
  obs?: Subject<any>,
}


export enum EnuDeleteSts  {
      DEL_OK,
      DEL_OK_WITH_SOMME_ERR,
      DEL_ERR
}
 
