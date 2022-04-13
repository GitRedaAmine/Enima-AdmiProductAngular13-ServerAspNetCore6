import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
 
 
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
    .subscribe
    (   
        (response)=>
          {
             this.data = response ;

             this.imagesProduct = [];
             this.imgUrlService.getImagesByProductId(this.data.uuid).subscribe( resp => 
              {
                this.imagesProduct= resp;

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


  
 
submit() {
// emppty stuff
}
 
deleteProduct()
{
  this.HttpProduct.Delete(this.data.uuid).subscribe( 
    res => {
              this.blockUIdropzone.stop();
              this.toastr.success("Delete product ID :"+ this.data.uuid  +" success", "Delete product")
              this.router.navigate(['admin/products'])  
          },
    err=> {
             this.toastr.success("error Delete product ID :"+ this.data.uuid  +" Error", "Delete Error")
         },
    () =>{
      console.log('DONE!')  
      this.blockUIdropzone.stop();
    } 
    
    )

 }

 _onBackProduct() {
  this.router.navigate(['admin/products'])
  

}
 
onDeleteClick( ): void {
  try {
    this.blockUIdropzone.start();
    console.log(this.imagesProduct) ;
    let cntImageDeleted=0; 
    if(this.imagesProduct.length==0){
      this.deleteProduct();
    }
    this.imagesProduct.forEach(elm => {
         console.log("delete image uuid : "+ elm.uuid) ;
          this.imgUrlService.Delete(elm.uuid).subscribe(
            resp=>{
              cntImageDeleted++; 
              console.log(JSON.stringify(resp) );
              if(cntImageDeleted===this.imagesProduct.length)
              {
                this.deleteProduct();
              }

            },
            err=>{
              cntImageDeleted++; 
              if(cntImageDeleted===this.imagesProduct.length)
              {
                this.deleteProduct();
              }
              console.error(err) ;
            }
          )
    })
    
    
  }
  catch (error) {
    this.blockUIdropzone.stop();
    console.error("catch "  +error);
  }

}

 
deleteImageFirebase( ): void {
 
    let cntImageDeleted=0; 
    if(this.imagesProduct.length>0)
    {
        this.imagesProduct.forEach(elm =>
        {
            let  upload:IFileDelReq={
              folderName: elm.productId,
              fileName: elm.name,
            }
            console.log("delete image uuid : "+ elm.uuid) ;
            this.uploadService.deleteFireBase(upload).subscribe
            (
            resp=>
            {
                if(resp.type ==  HttpEventType.Response)
                {
                    cntImageDeleted++; 
                    let  respDel:IFileDelResp= resp.body as IFileDelResp; ;
                    if(respDel.status)
                    {
                      this.toastr.success("delete file  :"+elm.name +" from directory : "+ elm.productId, "Delete file")
                    }
                    else
                    {
                      this.toastr.error(" erro delete file  :"+elm.name +" from directory : "+ elm.productId, "Delete file")
                    }
                    if(cntImageDeleted===this.imagesProduct.length)
                    {
                      this.deleteProduct();
                    }
                }
            },
            err=>{
              cntImageDeleted++; 
              if(cntImageDeleted===this.imagesProduct.length)
              {
                this.deleteProduct();
              }
              console.error(err) ;
            });
        })
    }
}

 


}