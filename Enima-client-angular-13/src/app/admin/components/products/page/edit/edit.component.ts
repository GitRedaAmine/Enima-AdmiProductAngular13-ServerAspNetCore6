import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
 
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
 
 
import { ToastrService } from 'ngx-toastr';
import { Subject, tap } from 'rxjs';
import { EnuUploadSts, IUpdateImage, IUploadInfo } from 'src/app/admin/models/admin.model';
 
import { IBrand } from 'src/app/shared/models/api/ibrand.model';
import { ICategorie } from 'src/app/shared/models/api/icategorie.model';
import { IFileDelReq, IFileDelResp, IFileUploadReq, IFileUploadResp,  IImageUrl, IProduct } from 'src/app/shared/models/api/iproduct.model';

 
import { ImageUrlService } from 'src/app/shared/services/api/imageUrl.service';
import { ProductService } from 'src/app/shared/services/api/product.service';
import { UploadService } from 'src/app/shared/services/api/upload.service';
 
import * as uuid from 'uuid';


 
export interface IEditInfo
{
    Cntr  :number,
    length:number,
    List? :any[]  
 
}

export interface IEditProduct
{
  add:IEditInfo,
  put:IEditInfo,
  del:IEditInfo,
}

 
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  UPLOADSTS: typeof EnuUploadSts;
  db_product: IProduct; 
  images:IUpdateImage [] =[] ;
  Obs_WaitUpdating?: Subject<any> = new Subject<any>();
 
  edit:IEditProduct ={ add :{Cntr:0, length:0},put :{Cntr:0, length:0},del :{Cntr:0, length:0} };
  uuid:string =""; 
  isLoaded:boolean =false; 
  startIdxAddedFile=0;

  constructor( private route: ActivatedRoute, 
                public router: Router ,
                private HttpProduct: ProductService,
                private HttpImageUrl: ImageUrlService,
                private uploadService: UploadService,
                private _http: HttpClient,
                private toastr: ToastrService ) 
    { }

ngOnInit(): void {
  this.UPLOADSTS = EnuUploadSts;
  this.route.paramMap.subscribe((params: ParamMap) => {
    this.uuid = params.get('uuid');
    this.onLoad(this.uuid);
 })
}
 
_onBackProduct() {
  this.router.navigate(['admin/products'])
}
onSelectBrand(brand: IBrand) {
  this.db_product.brandId=brand.uuid;
}
onSelectCategorie(categorie: ICategorie) {
  this.db_product.categorieId=categorie.uuid;
}

 
onLoad(uuid:string ) {
  console.log("onLoad ....." );
    this.HttpProduct.GetById(uuid) 
    .subscribe
    ((resp_p)=>
          {
            this.db_product = resp_p ;
            let db_images: IImageUrl[] = [];
            this.HttpImageUrl.getImagesByProductId(this.db_product.uuid).subscribe( resp_img => 
             {
                db_images= resp_img;
                console.log( db_images)
                db_images.forEach(elm=> {
                      let image:IUpdateImage ={
                        imageUrl: elm,
                        isChanged: false,
                        isNew: false,
                        isToDeleted: false,
                        isFromProduct: true,
                        src: elm.url,
                        file: undefined
                      };
                      this.images.push(image);
                  })  
                  console.log( this.images)
             }) 
             this.isLoaded=true;
          },
        (err) =>
        {
          this.toastr.error(err, "Error");
          console.log(err);
        }
    )
}

counterNewImage:number=0;
onAddNewFile(event) {

  let file:File = event.target.files[0];

  if (file) {

    if(!this.isMaxFile()){
    
        var ext =  file.name.split('.').pop();
        this.startIdxAddedFile++;
        var name = uuid.v4() +"_" + this.startIdxAddedFile +"."+ ext;
        let imageProduct: IImageUrl={
          name: name, uuid: "temp_uuid_" + this.counterNewImage,
          productId: this.db_product.uuid,
        };
        this.counterNewImage++;

        let image:IUpdateImage ={
          isChanged: false,
          isNew: true,
          isToDeleted: false,
          isFromProduct: false,
          imageUrl: imageProduct,
          file: file
        } 
        const reader = new FileReader();
        reader.onload = (e: any) => {
          image.src= (e.target.result);
          
        };
        reader.readAsDataURL(image.file);

        this.images.push(image);
        
         console.log(this.images )
    }
    else{
      this.toastr.error(" the max images in product must be less then 6 ", "error files ")
    }
  }
}
 


onEditImageClick(event: any, elm:IUpdateImage) {

  try {
    console.log("name image : " + elm.imageUrl.name);

    let idx = this.images.findIndex(x=> x.imageUrl.uuid== elm.imageUrl.uuid);
   
    if(idx>=0){
      this.images[idx].file= event.target.files[0];
      
      this.images[idx].isChanged= true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images[idx].src= (e.target.result);
       
      };
      reader.readAsDataURL(this.images[idx].file);
     
    } 

    console.log(this.images )
  }
  catch (error) {
    console.error("catch "  +error);
  } 
}
 
 
onDeleteImageClick( elm:IUpdateImage): void {
  try {

    let idx = this.images.findIndex(x=> x.imageUrl.uuid== elm.imageUrl.uuid);
    console.log("delete image idx :" +idx );
    if(idx>=0){
      if(this.images[idx].isFromProduct)
        this.images[idx].isToDeleted=true; 
      else
        this.images.splice(idx,1);      
    } 
    console.log(this.images )
  }
  catch (error) {
    console.error("catch "  +error);
  }
}


saveProduct()
{
  this.HttpProduct.Update(this.db_product.uuid, this.db_product).subscribe( 
    res => {
              this.toastr.success("update product ID :"+ this.db_product.uuid  +" success", "update product")
              this.router.navigate(['admin/products'])  
          },
    err=> {
             this.toastr.success("error update product ID :"+ this.db_product.uuid  +" Error", "update Error")
         },
    () => console.log('update DONE!')   
    
    )
 }

  
 
submit() {
// emppty stuff
}
 
 
 

build_UploadNewImages():IUploadInfo[]
{
  let uploadList :IUploadInfo[]=null;

  this.images.forEach(elm => 
    {
      if((elm.isToDeleted==false) && (elm.isFromProduct==false)
         && ((elm.isNew==true) || (elm.isChanged==true)) ) {
          if(uploadList ==null)
              uploadList=[];

        let upload:IUploadInfo ={
          imageUrl: elm.imageUrl,
          obs: new Subject<any>(),
          isStartUploading: false,
          isUploaded: false,
          isUploadedToFirebase: false,
          state: EnuUploadSts.WAIT_START,
          file: elm.file
        } 
        uploadList.push(upload);

      }
     
    }) 
  return   uploadList;
}
build_UploadUpdateImages():IUploadInfo[]
{
  let uploadList :IUploadInfo[]=null;

  this.images.forEach(elm => 
    {
      if((elm.isToDeleted==false) && (elm.isFromProduct==true)
      && ((elm.isNew==false) && (elm.isChanged==true)) ) {
        if(uploadList ==null)
            uploadList=[];
        let upload:IUploadInfo ={
          imageUrl: elm.imageUrl ,
          obs: new Subject<any>(),
          isStartUploading: false,
          isUploaded: false,
          file:elm.file,
          isUploadedToFirebase: false,
          state:  EnuUploadSts.WAIT_START,
        } 
        uploadList.push(upload);

      }
     
    }) 
  return   uploadList;
}
build_DeletedImages():IImageUrl[]
{
  let deletedList :IImageUrl[]=null;

  this.images.forEach(elm => 
    {
      if(((elm.isToDeleted==true) &&(elm.isFromProduct==true))
        // || ((elm.isChanged==true) &&(elm.isFromProduct==true))
      ) {
        if(deletedList ==null)
            deletedList=[];
        deletedList.push(elm.imageUrl);
      }
    }) 
  return   deletedList;
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
onUploadImagesClick() {
 
  try {
 
    this.edit.del.List=this.build_DeletedImages();
    this.edit.add.List = this.build_UploadNewImages();
    this.edit.put.List = this.build_UploadUpdateImages();
    if(this.edit.del.List !==null)
      this.edit.del.length= this.edit.del.List.length;
    if(this.edit.add.List !==null)
      this.edit.add.length= this.edit.add.List.length;   
    if(this.edit.put.List !==null)
      this.edit.put.length= this.edit.put.List.length;



    console.log("edit.del.List:"+  this.edit.del.length) 
    console.log("edit.add.List:"+  this.edit.add.length)
    console.log("edit.put.List:"+ this.edit.put.length)
  
    if(( this.edit.add.length==0 ) && (this.edit.del.length==0)&& ( this.edit.put.length==0)){
      this.toastr.info("no image to updating or to add or to delete   ", "uploading")
      this.saveProduct();
    
      return 
    }

 
   
    this.edit.del.List?.forEach(elm => 
    {
        console.log("delete image :  "+elm.name  )
        let  upload:IFileDelReq={
          folderName: elm.productId,
          fileName: elm.name,
        }
        console.log("delete image uuid : "+ elm.uuid) ;
        this.uploadService.deleteFireBase(upload).subscribe
        (
        (respDel:IFileDelResp)=>
        {
            console.log(respDel);
            if(respDel.status)
            {
              this.toastr.success("delete file  :"+elm.name +" from directory : "+ elm.productId, "Delete file")
              this.HttpImageUrl.Delete(elm.uuid )
              .subscribe(
              resp=>{
                console.log(resp);
                this.edit.del.Cntr++; 
                if(this.edit.del.Cntr==this.edit.del.length){
                  console.log("delete all  deleted image : ");
                    {
                      this.Obs_WaitUpdating.next(this.edit);
                    }
                }
                this.toastr.success("Deleting image :"+ elm.name  +" success", "Deleting")
              },
              err=>{  
                this.toastr.error("Error deleting image :"+ elm.name  +"  " + err, "Error Deleting")
              })
            }
            else
            {
              this.toastr.error(" erro delete file  :"+elm.name +" from directory : "+ elm.productId, "Delete file")
            }
        },
        err=>{
          this.toastr.error(  err,"Error ")
          console.error(err) ;
        });
    })  
   

 
    
    this.edit.add.List?.forEach(elm => 
    {
      console.log("new image :  "+elm.imageUrl.name  )
      
      elm.obs.asObservable().subscribe(resp =>{
        this.edit.add.Cntr++; 
        if(this.edit.add.Cntr== this.edit.add.length){
          console.log("add all new image :  ")
          this.Obs_WaitUpdating.next(this.edit);
        }
      });
      this.uploadImageOfProduct(this.db_product.uuid, elm, true);
    })  
 
    
    this.edit.put.List?.forEach(elm => 
    {
      console.log("update image :  "+elm.imageUrl.name  )
    
      elm.obs.asObservable().subscribe(resp =>{
        this.edit.put.Cntr++;
        if(this.edit.put.Cntr== this.edit.put.length){
          console.log("update all new image :  ")
          this.Obs_WaitUpdating.next(this.edit);
        } 
      });
      this.uploadImageOfProduct(this.db_product.uuid, elm, false);
    })  

    this.Obs_WaitUpdating.asObservable().subscribe(resp =>
      {

        console.log("del.length : "+  this.edit.del.length +"  - del.Cntr : "+ this.edit.del.Cntr ) 
        console.log("add.length : "+  this.edit.add.length +"  - add.Cntr : "+ this.edit.add.Cntr )
        console.log("put.length : "+  this.edit.put.length +"  - put.Cntr : "+ this.edit.put.Cntr )

          if((this.edit.add.Cntr == this.edit.add.length)
             && (this.edit.del.Cntr == this.edit.del.length)
             && (this.edit.put.Cntr == this.edit.put.length)
          
          ){
            console.log("save product process : " )
            this.saveProduct();
          }


      })

  }
  catch (error) {
    console.error(error);
    this.toastr.error(error , "uploading")
  }
}


uploadImageOfProduct(productId:string, elm:IUploadInfo , isToAdd:boolean)  {
 
  try 
  {
    let Req :IFileUploadReq = {
      folderName: productId.toString(),
      fileName: elm.imageUrl.name,
      file: elm.file
    }; 
    console.log(Req);
    this.uploadService.uploadFireBase( Req )  
    .subscribe((event: HttpEvent<any>) =>
    {
      switch (event.type) {
        case HttpEventType.Sent:
         // console.log('Request has been made');
          elm.isStartUploading=true;
          elm.msg = "starting ...";
          elm.state = EnuUploadSts.START_UPLOAD  ;
          break;
        case HttpEventType.ResponseHeader:
         // console.log('Response header has been received!');
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
           // console.log('User successfully created');
            let Resp :IFileUploadResp = event.body as IFileUploadResp; 
            console.log(Resp);
            elm.imageUrl.url=Resp.url;
            elm.isUploadedToFirebase = true;
            elm.msg = "file uploaded Ok ";
            elm.state = EnuUploadSts.UPLOADED_FIREBASE  ;
            elm.imageUrl.productId=productId;
            console.log(elm.imageUrl)  
            if(isToAdd){
                elm.imageUrl.uuid=null;
                this.HttpImageUrl.Add( elm.imageUrl  ).subscribe(
                  resp =>
                  {
                    console.log(resp)   ;
                    elm.obs.next(elm);
                  },
                  err=>{
                    elm.obs.next(elm);
                    console.log(err)  
                  }
                )
              }
            else{
                this.HttpImageUrl.Update( elm.imageUrl.uuid, elm.imageUrl  ).subscribe(
                  resp =>
                  {
                    console.log(resp)   ;
                    elm.obs.next(elm);
                  },
                  err=>{
                    elm.obs.next(elm);
                    console.log(err)  
                  }
                )}
            setTimeout(() => {
              elm.msg  = "";
            }, 1500);
      }
    })
  }
  catch (error) {
    console.error(error);
    this.toastr.error(error , "uploading")
  }
}

   


 











}