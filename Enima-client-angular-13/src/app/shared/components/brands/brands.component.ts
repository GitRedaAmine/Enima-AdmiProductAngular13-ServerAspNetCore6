import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IBrand } from '../../models/api/ibrand.model';
import { BrandService } from '../../services/api/brand.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {

  public brands :  IBrand[] = [];   
  brandUuid: string;
 
  @Input() brandId: string;
  
  @Output() BrandEvent: EventEmitter<IBrand> = new EventEmitter<IBrand>();
  
  
  constructor(    private HttpBrand: BrandService,
                  private toastr: ToastrService) 
  { }

  ngOnInit(): void {

    this.load()
  }

 

  onChangeSelection() {
   // console.log(this.brandUuid);
    let brand: IBrand = this.brands.find(
      (x) => x.uuid == this.brandUuid
    );
   // console.log(brand);
    if(brand)
      this.BrandEvent.emit(brand);
  }


  load()
  {
   this.HttpBrand.GetAll().subscribe
   (
         (response)=>
         {
           this.brands = response;

 
           let brand: IBrand = this.brands.find(
             (x) => x.uuid == this.brandId
           );
           this.brandUuid = brand?.uuid;
          // console.log('brandUuid :' + this.brandUuid);

           if(!this.brandUuid)
              this.brandUuid=this.brands.length>0?this.brands[0].uuid:"nan"
            this.onChangeSelection()
         },
         (errorReponse) => {
 
           let errMsg: string;
           if (!navigator.onLine) {
             errMsg = "Check your internet connection and try again";
           }
           else if (errorReponse.error instanceof ErrorEvent) {
             // A client-side or network error occurred. Handle it accordingly.
             errMsg =  `An error occurred:  +  ${errorReponse.error.message}`  ;
           } else if(errorReponse.error instanceof ProgressEvent){
               errMsg =  `An error occurred:  +  ${errorReponse.message } message: ${errorReponse.statusText } ERR_CONNECTION_REFUSED`     ;
           }
           else {
             // The backend returned an unsuccessful response code.
             // The response body may contain clues as to what went wrong,
             errMsg =`Backend returned code ${errorReponse.status}   message:  ${errorReponse.error}`
           }
           this.toastr.error(errMsg, "Error");
           console.log(errorReponse);
         }
     )
  }

  
}
