import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import {  Subject } from 'rxjs';
import { FilePickerDirective } from 'src/app/admin/directives/file-picker.directive';
import { EnuUploadSts, IUploadInfo } from 'src/app/admin/models/admin.model';
import { IBrand } from 'src/app/shared/models/api/ibrand.model';
import { ICategorie } from 'src/app/shared/models/api/icategorie.model';
import { IFileUploadReq, IFileUploadResp, IImage, IImageUrl, IProduct } from 'src/app/shared/models/api/iproduct.model';
import { ImageUrlService } from 'src/app/shared/services/api/imageUrl.service';
import { ProductService } from 'src/app/shared/services/api/product.service';
import { UploadService } from 'src/app/shared/services/api/upload.service';
import * as uuid from 'uuid';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  UPLOADSTS: typeof EnuUploadSts;
  data: IProduct; 
  uploads :IUploadInfo[]=[];
  uuid:string =""; 
  isLoaded:boolean =false; 
  startIdxAddedFile=0;


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
  let idxName=0;
  this.uploads=[];
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.split('/')[0] !== 'image') {
       this.toastr.success("unsupported file type :"+ files[i].name  , "error type")
       console.error('unsupported file type');
    }
    else
    {
      idxName++;
      var ext =   files[i].name.split('.').pop();
      let upload:IUploadInfo ={
        imageUrl: { name: uuid.v4() +"_"+ idxName + "." + ext },
        obs: new Subject<any>(),
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
   
onChangeFile(event: any, elm:IUploadInfo) {
  
   
    try {
      let idx = this.uploads.findIndex(x=> x.imageUrl.name== elm.imageUrl.name);
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
   
  
  
CntrUploadedImages:number=0;
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
  

uploadImageOfProduct(productId:string, elm:IUploadInfo)  {
 
  try 
  {
    let Req :IFileUploadReq = {
      folderName: productId.toString(),
      fileName: elm.imageUrl.name,
      file: elm.file
    }; 

    this.uploadService.uploadFireBase( Req )  
    .subscribe((event: HttpEvent<any>) =>
    {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made');
          elm.isStartUploading=true;
          elm.msg = "starting ...";
          elm.state = EnuUploadSts.START_UPLOAD  ;
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          elm.percentage = Math.round(event.loaded / event.total * 100);
          // console.log(`Uploading ${ elm.percentage}%`);
          elm.msg = "Uploading file   " +   elm.percentage +"%"   ;
          if( elm.percentage>=100){
            elm.isUploaded = true;
            elm.msg = "waiting firebase...";
            elm.src="assets/waiting2_firebase.gif";
            elm.state = EnuUploadSts.UPLOADED_WAIt_FIREBASE  ;
          }
          break;
          case HttpEventType.Response:
            console.log('User successfully created');
            let Resp :IFileUploadResp = event.body as IFileUploadResp; 
          //  console.log(Resp);
            elm.imageUrl.url=Resp.url;
            elm.isUploadedToFirebase = true;
            elm.msg = "file uploaded Ok ";
            elm.state = EnuUploadSts.UPLOADED_FIREBASE  ;
            elm.imageUrl.productId=productId;
            this.imgUrlService.Add( elm.imageUrl  ).subscribe(
              resp =>
              {
                 console.log(resp)   ;
                 this.CntrUploadedImages++;
                 if(this.CntrUploadedImages=== this.uploads.length)
                 {
                   this.blockUIdropzone.stop();
                   this.router.navigate(['admin/products'])
                 }

              },
              err=>{
                this.CntrUploadedImages++;

                if(this.CntrUploadedImages=== this.uploads.length)
                 {
                   this.blockUIdropzone.stop();
                   this.router.navigate(['admin/products'])
                 }

                 console.log(err)  
              }
            )
            setTimeout(() => {
              elm.msg  = "";
            }, 1500);
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