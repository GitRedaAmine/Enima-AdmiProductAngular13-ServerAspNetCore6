import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subject, tap } from 'rxjs';
 
 
import { IFileDelReq, IFileDelResp, IImage, IImageUrl, IProduct } from 'src/app/shared/models/api/iproduct.model';
import { ImageUrlService } from 'src/app/shared/services/api/imageUrl.service';
 
import {  ProductService } from 'src/app/shared/services/api/product.service';
import { UploadService } from 'src/app/shared/services/api/upload.service';


 
@Component({
  selector: 'app-del',
  templateUrl: './del.component.html',
  styleUrls: ['./del.component.css']
})
export class DelComponent implements OnInit {
 
  @BlockUI('dropzoneBlockui') blockUIdropzone: NgBlockUI;
  data: IProduct=null; 
  imagesProduct: IImageUrl[]; 

  Notif_ToDelProduct:Subject<IProduct> = new Subject<IProduct>();
  Notif_DelFile:Subject<IImageUrl> = new Subject<IImageUrl>();

  
  uuid:string =""; 
  isLoaded:boolean =false; 
   constructor( private route: ActivatedRoute, 
                public router: Router ,
                private HttpProduct: ProductService,
                private uploadService: UploadService,
                private imgUrlService:ImageUrlService,
                private toastr: ToastrService ) 
    { }

ngOnInit(): void {
  this.route.paramMap.subscribe((params: ParamMap) => {
    this.uuid = params.get('uuid');
    this.onLoad(this.uuid);
 })
}
 
onLoad(uuid:string ) {
    this.HttpProduct.GetById(uuid) 
    .subscribe ( (resp)=>{
                this.data = resp ;
                this.imagesProduct = [];
                this.imgUrlService.getImagesByProductId(this.data.uuid).subscribe( resp =>{ this.imagesProduct= resp}) 
                this.isLoaded=true;
          },
        (err) => {this.toastr.error(err, "Error");console.log(err)}
    )


    this.Notif_DelFile.asObservable().subscribe(elm =>
      { this.onNotif_DelFile(elm)})

    this.Notif_ToDelProduct.asObservable().subscribe(elm =>
        { this.onNotif_ToDelProduct(elm)})
}


  
 
submit() {
// emppty stuff
}
 
 

 _onBackProduct() {
  this.router.navigate(['admin/products'])

}
 
 

 
_onDelfiles( ): void {
    this.blockUIdropzone.start();
    if(this.imagesProduct.length>0)
    {
        this.imagesProduct.forEach(elm =>
        {
          // delete image from firebase 
          let upload:IFileDelReq={ folderName: elm.productId, fileName: elm.name,};
          console.log(upload);
          this.uploadService.del(upload)
          .subscribe( resp=>{
                    console.log(resp);
                    if(resp.status)
                    {
                      this.toastr.success("delete file  :"+upload.fileName +" from directory : "+ upload.folderName, "Delete file");
                      let image:IImageUrl ={name:elm.name, uuid:elm.uuid,productId:elm.productId};
                      // notification to delete image from table imageUrl
                      this.Notif_DelFile.next(image)
                    }
                    else
                      this.toastr.error(" erro delete file  :"+upload.fileName +" from directory : "+ upload.folderName, "Delete file")
            },
            err=>{console.error(err) });
           
        })
    }
    else
    {
        this.Notif_ToDelProduct.next(this.data);
    }
}

 
onNotif_ToDelProduct(p:IProduct)
{
  this.toastr.success("the product ID :"+ p.uuid  +" is successefly deleted ", "deleted product");
  this.HttpProduct.Delete(p.uuid).subscribe( 
    res => {
              this.blockUIdropzone.stop();
              this.toastr.success("Delete product ID :"+ p.uuid  +" success", "Delete product")
              this.router.navigate(['admin/products'])  
          },
    err=> {
             this.toastr.success("error Delete product ID :"+ p.uuid  +" Error", "Delete Error")
         },
    () =>{
      console.log('DONE!')  
      this.blockUIdropzone.stop();
    } 
    
    )
}

CounterDeletedFile:number=0; 
onNotif_DelFile(img:IImageUrl)
{
  console.log("delete image to table :" );
  console.log(img );

  this.imgUrlService.Delete(img.uuid).subscribe(
    resp =>
    {
       console.log(resp)   ;
      // this.blockUIdropzone.stop();
      this.CounterDeletedFile++;
      if(this.CounterDeletedFile ==  this.imagesProduct.length){
        this.Notif_ToDelProduct.next(this.data);

      }
    },
    err=>{
      //this.blockUIdropzone.stop();
      this.CounterDeletedFile++;
       console.log(err)  
    }
  )
}

}