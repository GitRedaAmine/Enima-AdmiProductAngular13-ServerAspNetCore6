 
import { Subject } from "rxjs";
import { IImage, IImageUrl } from "src/app/shared/models/api/iproduct.model";

 
export interface IUpdateImage  {
  imageUrl ?    :IImageUrl  ,
  file:File,
  isToDeleted? :boolean,
  isChanged? :boolean,
  isNew?:boolean,
  isFromProduct?:boolean,
  src?:string | ArrayBuffer | null,
  percentage ?: number,
}


export enum EnuUploadSts
{
    WAIT_START,
    START_UPLOAD,
    UPLOADED_WAIt_FIREBASE,
    UPLOADED_FIREBASE,
}


export interface IUploadInfo   {
  imageUrl ?    :IImageUrl  ,
  percentage ?: number,
  src ?:string;
  file:File;
  isUploadedToFirebase :boolean,
  isUploaded  :boolean,
  isStartUploading:boolean,
  msg?:string,
  state:  EnuUploadSts,
  obs?: Subject<any>,
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
 
