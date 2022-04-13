import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ICategorie } from '../../models/api/icategorie.model';
import { CategorieService } from '../../services/api/categorie.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  public categories :  ICategorie[] = [];   
  catUuid: string;
 
  @Input() catId: string;
  @Output() CategorieEvent: EventEmitter<ICategorie> = new EventEmitter<ICategorie>();
  
  
  constructor(    private HttpService: CategorieService,
                  private toastr: ToastrService) 
  { }

  ngOnInit(): void {

    this.load()
  }

 

  onChangeSelection() {
    //console.log(this.catUuid);
    let cat: ICategorie = this.categories.find(
      (x) => x.uuid == this.catUuid
    );
    //console.log(cat);
    if(cat)
      this.CategorieEvent.emit(cat);
  }


  load()
  {
   this.HttpService.GetAll().subscribe
   (
         (response)=>
         {
         // console.log(response);
           this.categories = response;
           //console.log(this.categories);
 
           let cat: ICategorie = this.categories.find(
             (x) => x.uuid == this.catId
           );
           this.catUuid = cat?.uuid;
          // console.log('catUuid :' + this.catUuid);
           if(!this.catUuid)
           this.catUuid=this.categories.length>0?this.categories[0].uuid:"nan"
           this.onChangeSelection();
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
