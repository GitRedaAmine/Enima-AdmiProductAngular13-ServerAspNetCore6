import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import {  Subject } from 'rxjs';
import { FilePickerDirective } from 'src/app/admin/directives/file-picker.directive';
import { EnuUploadSts, IUploadAdd,  } from 'src/app/admin/models/admin.model';
import { IBrand } from 'src/app/shared/models/api/ibrand.model';
import { ICategorie } from 'src/app/shared/models/api/icategorie.model';
import {  IFileAddReq, IFileUploadResp, IImageUrl, IProduct } from 'src/app/shared/models/api/iproduct.model';
import { ImageUrlService } from 'src/app/shared/services/api/imageUrl.service';
import { ProductService } from 'src/app/shared/services/api/product.service';
import { UploadService } from 'src/app/shared/services/api/upload.service';
import * as uuid from 'uuid';

const ADD_ICON="add"
const UPLOAD_ICON="cloud_upload"

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  UPLOADSTS: typeof EnuUploadSts;
  data: IProduct; 
  uploads :IUploadAdd[]=[];
  uuid:string =""; 
  isLoaded:boolean =false; 
  startIdxAddedFile=0;

  NotifAddProduct:Subject<IProduct> = new Subject<IProduct>();
  NotifUploadImage:Subject<IImageUrl> = new Subject<IImageUrl>();
  NotifAddImage:Subject<IProduct> = new Subject<IProduct>();
  isProductAdded :boolean=false; 
  isUploading :boolean=false; 
  NavAddingIcon:string =ADD_ICON; 




  @BlockUI('dropzoneBlockui') blockUIdropzone: NgBlockUI;
  @ViewChild('dropZonePicker', { static: true })
  _dropZonePicker: FilePickerDirective;

  
   constructor( private route: ActivatedRoute, 
                public router: Router ,
                private _http: HttpClient,
                private HttpProduct: ProductService,
                private uploadService: UploadService,
                private imgUrlService:ImageUrlService,
                private toastr: ToastrService ) 
    { }

ngOnInit(): void {
  this.UPLOADSTS = EnuUploadSts;
    this.data =  { 
        name :"name_"+uuid.v4(),  
        description :"your description", 
        price :10,
        rating :10,
        stocks :10,
        brandId:"",
        categorieId:"",
    }

    this.NotifAddProduct.asObservable().subscribe( p => {
      console.log(p);
      console.log("start uploading images .....");
    })


    this.NotifUploadImage.asObservable().subscribe( p => {
      console.log(p);
      this.onUploadedImage(p);
    })
}

onAddingProcessClick(){

  if(!this.isProductAdded){
    this.addProductInfomation();
  }
  else{
    this.toastr.error("the product ID:" + this.data.uuid + " is already added ..")
  }
}

onUploadProcessClick() {
  this.isUploading=true; 
  if(this.uploads.length>0){
 
    this.uploads.forEach(elm => 
    {
        this.uploadImageOfProduct(this.data.uuid, elm);
    })
  }
  else
    this.isUploading=false; 
 
}


addProductInfomation() {

  this.HttpProduct.Add(this.data)
  .subscribe( 
    res => {
      this.data.uuid=res.uuid;
      this.toastr.success("the product ID :"+ this.data.uuid  +" is successefly added ", "add product");
      this.toastr.warning("next step is to uploading images ", "uploading");
      this.isProductAdded=true; 
      this.NotifAddProduct.next(this.data);
 
    },
    error =>{
      this.toastr.error("error add product : " + error, "Error");
    } 
  )
}



onUploadedImage( img:IImageUrl) {
  this.imgUrlService.Add(img).subscribe(
    resp =>
    {
       console.log(resp)   ;
       this.blockUIdropzone.stop();
    },
    err=>{
      this.blockUIdropzone.stop();
       console.log(err)  
    }
  )
}
 
onSelectBrand(brand: IBrand) {
  this.data.brandId=brand.uuid;
}
onSelectCategorie(categorie: ICategorie) {
  this.data.categorieId=categorie.uuid;
}
 
 
_onReset() {
  this.uploads=[];
}


_reset() {
  this._dropZonePicker.reset();
}

_onFilesChanged(files: FileList) {

  this.uploads=[];
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.split('/')[0] !== 'image') {
       this.toastr.success("unsupported file type :"+ files[i].name  , "error type")
       console.error('unsupported file type');
    }
    else
    {
      let upload:IUploadAdd ={
        isStartUploading: false,
        isUploaded: false,
        isUploadedToFirebase: false,
        state: EnuUploadSts.WAIT_START,
        file: files[i]
      } 
      
     const readerUpload = new FileReader();
     readerUpload.onload = (e: any) => {
      upload.src= (e.target.result);
      };
      readerUpload.readAsDataURL(upload.file);
      this.uploads.push(upload);
     
    }
  } 
}

_filesMax(message :string) {
  console.error(message);
  this.toastr.error(message, "filesMax");
}
 
 
_onBackProduct() {
  this.router.navigate(['admin/products'])
}
 
submit() {
  // emppty stuff
}
   
onChangeFile(event: any, elm:IUploadAdd) {
  
   
    try {
      let idx = this.uploads.findIndex(x=> x.file.name== elm.file.name);
      if(idx>=0){
        this.uploads[idx].file= event.target.files[0];
     
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploads[idx].src= (e.target.result);
        };
        reader.readAsDataURL(this.uploads[idx].file);
      } 
    }
    catch (error) {
      console.error("catch "+error);
    } 
  
  }
   
 
  

 onAddProductClick() {
 
  try {
  
    this.blockUIdropzone.stop();
    this.HttpProduct.Add(this.data)
    .subscribe( 
      res => {
        this.data.uuid=res.uuid;
        this.toastr.success("save product ID :"+ this.data.uuid  +" success", "save product");
        this.toastr.warning("thes images will start uploading   ....", "uploading");
        if(this.uploads.length>0){
          this.blockUIdropzone.start();
          this.uploads.forEach(elm => 
          {
              this.uploadImageOfProduct(this.data.uuid, elm);
          })
        }
        else{
            this.blockUIdropzone.stop();
            this.router.navigate(['admin/products'])
        }
      },
      error =>{
        this.blockUIdropzone.stop();
        this.toastr.error("error save product ID :"+ this.data.uuid  +"  " + error, "Error");
      } 
    )
  }
  catch (error) {
    this.blockUIdropzone.stop();
    this.toastr.error("error save product ID :"+ this.data.uuid  +"  " + error, "Error");
  }
}
  

uploadImageOfProduct(productId:string, elm:IUploadAdd)  {
 
  try 
  {
    this.blockUIdropzone.start();
    let Req :IFileAddReq = {
      folderName: productId.toString(),
      file: elm.file
    }; 

    this.uploadService.addNew( Req )  
    .subscribe((event: HttpEvent<any>) =>
    {
      switch (event.type) {
        case HttpEventType.Sent:
          elm.isStartUploading=true;
          elm.state = EnuUploadSts.START_UPLOAD  ;
          break;
        case HttpEventType.UploadProgress:
          elm.percentage = Math.round(event.loaded / event.total * 100);
          if( elm.percentage>=100){
            elm.isUploaded = true;
            elm.msg = "waiting firebase...";
            elm.src="assets/waiting2_firebase.gif";
            elm.state = EnuUploadSts.UPLOADED_WAIt_FIREBASE  ;
          }
          break;
          case HttpEventType.Response:
            let Resp :IFileUploadResp = event.body as IFileUploadResp; 
            console.log(Resp);
            let image:IImageUrl ={
                url:Resp.url,
                name:Resp.fileName,
                productId:productId,
            };
            elm.src=Resp.url;
            elm.isUploadedToFirebase = true;
            elm.msg = "file uploaded Ok ";
            elm.state = EnuUploadSts.UPLOADED_FIREBASE  ;
            this.NotifUploadImage.next(image);
      }
    })
  }
  catch (error) {
    console.error(error);
    this.blockUIdropzone.stop();
    this.toastr.error(error , "uploading")
  }
}
  
 
} 