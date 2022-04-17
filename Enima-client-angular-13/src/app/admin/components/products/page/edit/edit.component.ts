import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
 
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
 
 
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, tap } from 'rxjs';
import { EnuUploadSts, IUploadPut,  } from 'src/app/admin/models/admin.model';
 
import { IBrand } from 'src/app/shared/models/api/ibrand.model';
import { ICategorie } from 'src/app/shared/models/api/icategorie.model';
import { IFileAddReq, IFileDelReq, IFileDelResp,    IFileUpdateReq,    IFileUploadResp,  IImageUrl, IProduct } from 'src/app/shared/models/api/iproduct.model';

 
import { ImageUrlService } from 'src/app/shared/services/api/imageUrl.service';
import { ProductService } from 'src/app/shared/services/api/product.service';
import { UploadService } from 'src/app/shared/services/api/upload.service';
 
import * as uuid from 'uuid';

 
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  UPLOADSTS: typeof EnuUploadSts;
  isProductEdited :boolean=false; 


  db_product: IProduct; 
  images:IUploadPut [] =[] ;

  Notif_PutProduct:Subject<IProduct> = new Subject<IProduct>();
  Notif_AddFile:Subject<IImageUrl> = new Subject<IImageUrl>();
  Notif_DelFile:Subject<IImageUrl> = new Subject<IImageUrl>();

  uuid:string =""; 
  isLoaded:boolean =false; 

  constructor( private route: ActivatedRoute, 
                public router: Router ,
                private HttpProduct: ProductService,
                private imgUrlService: ImageUrlService,
                private uploadService: UploadService,
                private _http: HttpClient,
                private toastr: ToastrService ) 
    { }

ngOnInit(): void {
  this.UPLOADSTS = EnuUploadSts;

  this.route.paramMap
      .subscribe((params: ParamMap) => {this.uuid = params.get('uuid');this.load(this.uuid) });

  this.Notif_PutProduct.asObservable()
      .subscribe(p =>{this.onNotif_PutProduct(p)});

  this.Notif_AddFile.asObservable()
      .subscribe(resp=>{ this.onNotif_AddFile(resp) });

  this.Notif_DelFile.asObservable()
      .subscribe(resp=>{ this.onNotif_DelFile(resp) });
}
 
_onBackProduct() {
  this.router.navigate(['admin/products'])
}
_onSelectBrand(brand: IBrand) {
  this.db_product.brandId=brand.uuid;
}
_onSelectCategorie(categorie: ICategorie) {
  this.db_product.categorieId=categorie.uuid;
}

 
load(uuid:string ) {
  console.log("onLoad ....." );
    this.HttpProduct.GetById(uuid) 
    .subscribe
    ((resp_p)=>
          {
            this.db_product = resp_p ;
            this.imgUrlService.getImagesByProductId(this.db_product.uuid).subscribe( resp_img => {
                let db_images: IImageUrl[] = resp_img;

                db_images.forEach(elm=> {
                      let image:IUploadPut ={
                        src: elm.url, uuid: elm.uuid, name: elm.name, isChanged: false, isNew: false, isToDeleted: false, isFromProduct: true,
                        file: undefined, isUploadedToFirebase: false, isUploaded: false, isStartUploading: false, state: EnuUploadSts.WAIT_START,
                        id:  this.images.length +1,
                      };
                      this.images.push(image);
                  }) 
                }) 
             this.isLoaded=true}
        ,(err) => {
          this.toastr.error("an error is occued when try to connect to server , check your connection", "Error");
          this.toastr.error(err, "Error");
          console.log(err)} )
}

 
submit() {
  // emppty stuff
}
   
   

onNotif_AddFile( img:IImageUrl) {
  console.log("add image to table :" );
  console.log(img );
  this.imgUrlService.Add(img).subscribe(
    resp =>
    {
       console.log(resp)   ;
      // this.blockUIdropzone.stop();
    },
    err=>{
      //this.blockUIdropzone.stop();
       console.log(err)  
    }
  )
}

onNotif_DelFile( img:IImageUrl) {
  console.log("delete image to table :" );
  console.log(img );

  this.imgUrlService.Delete(img.uuid).subscribe(
    resp =>
    {
       console.log(resp)   ;
      // this.blockUIdropzone.stop();
    },
    err=>{
      //this.blockUIdropzone.stop();
       console.log(err)  
    }
  )
}

onNotif_PutProduct( p:IProduct) {
  this.toastr.success("the product ID :"+ p.uuid  +" is successefly updated ", "update product");
  this.toastr.warning("next step is to uploading images ", "uploading");
  this.isProductEdited=true; 
}

  
_onAddNewFile(event) {
  let file:File = event.target.files[0];
  if (file) {
    if(!this.isMaxFile()){
        let image:IUploadPut ={
          isChanged: false, isNew: true, isToDeleted: false, isFromProduct: false, file: file, uuid: null,
          name: null, isUploadedToFirebase: false, isUploaded: false, isStartUploading: false, state: EnuUploadSts.WAIT_START,
          id:  this.images.length+1,
        } 
        const reader = new FileReader();
        reader.onload = (e: any) => {image.src= (e.target.result);};
        reader.readAsDataURL(image.file);
        this.images.push(image);
        console.log(this.images )}
    else{this.toastr.error(" the max images in product must be less then 6 ", "error files ") }
  }
}
 


_onEditImageClick(event: any, elm:IUploadPut) {
    console.log("name image ID: " + elm.uuid);
    elm.file= event.target.files[0];
    elm.isChanged= true;
    const reader = new FileReader();
    reader.onload = (e: any) => { elm.src= (e.target.result)};
    reader.readAsDataURL( elm.file);
    console.log(this.images ) 
}
 
 
_onDeleteImageClick( elm:IUploadPut): void {

    if(elm.isFromProduct)
        elm.isToDeleted=true; 
    else{
        
        let idx = this.images.findIndex(x=> x.id=== elm.id);
        console.log("delete image idx :" +idx );
        if(idx>=0) 
            this.images.splice(idx,1);     
    }
    console.log(this.images )
}

_onEditProductClick()
{
  this.HttpProduct.Update(this.db_product.uuid, this.db_product)
  .subscribe( 
    res => {
      this.db_product.uuid=res.uuid;
      this.Notif_PutProduct.next(this.db_product) } 
    ,error =>{
      this.toastr.error("error add product : " + error, "Error")} 
  )
 
  this.uploadingImages(); 
 

}
 

uploadingImages()  {
 
  try 
  {
    this.images.forEach(elm => 
      {
        if(elm.isToDeleted){
          console.log("elm is to del ");
          // delete image from firebase 
          let upload:IFileDelReq={ folderName: this.db_product.uuid, fileName: elm.name,};
          console.log(upload);
          this.uploadService.del(upload)
          .subscribe( resp=>{
                    if(resp.status)
                    {
                      this.toastr.success("delete file  :"+upload.fileName +" from directory : "+ upload.folderName, "Delete file");
                      let image:IImageUrl ={name:elm.name, uuid:elm.uuid,productId:this.db_product.uuid};
                      // notification to delete image from table imageUrl
                      this.Notif_DelFile.next(image)
                    }
                    else
                      this.toastr.error(" erro delete file  :"+upload.fileName +" from directory : "+ upload.folderName, "Delete file")
            },
            err=>{console.error(err) });
        }
        else {
          //update image to firebase 
          let obs : Observable<any> =null;
           if((elm.isNew===true) && (elm.isFromProduct ===false))
           {
               // add new  image to firebase 
              console.log("elm is to add ");
              let Req :IFileAddReq = { folderName: this.db_product.uuid.toString(),file: elm.file}; 
              obs =   this.uploadService.addNew( Req )  ;
           }
           else if((elm.isFromProduct ===true ) && (elm.isChanged ===true))
           {
              // update   image to firebase 
              console.log("elm is to update ");
              let Req :IFileUpdateReq = {
                folderName: this.db_product.uuid.toString(),file: elm.file, uuid: elm.uuid,fileName:elm.name , }; 
              obs =   this.uploadService.update( Req )  ;
              // notification to delete image from table imageUrl
              let image:IImageUrl ={name:elm.name, uuid:elm.uuid,productId:this.db_product.uuid};
              this.Notif_DelFile.next(image)
          }
           if(obs !==null){
              obs.subscribe((event: HttpEvent<any>) =>
              {
                // wait response or add or update image to fireBase
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
                          productId:this.db_product.uuid,
                      };
                      elm.src=Resp.url;
                      elm.isUploadedToFirebase = true;
                      elm.msg = "file uploaded Ok ";
                      elm.state = EnuUploadSts.UPLOADED_FIREBASE  ;
                       // notification to update image in  table imageUrl
                      this.Notif_AddFile.next(image);
                }
              })
            }
        }
      }) 
        
  }
  catch (error) {
    console.error(error);
    this.toastr.error(error , "uploading")
  }
}



isMaxFile(): boolean
{
  let counter=0; 
  this.images.forEach(elm => 
    {
      if(elm.isToDeleted==false) {
        counter++;
      }
    }) 

  if(counter>=6)
    return true;
  return false; 
}
 
}