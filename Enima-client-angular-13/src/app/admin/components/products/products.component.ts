import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/api/product.service';
 
 
import { ExtentionDataSource } from './extention-data-source';
import * as uuid from 'uuid';
import { fromEvent } from 'rxjs';
import { IProduct } from 'src/app/shared/models/api/iproduct.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  /**
   *  child page
   */
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;


  /**
   *  table 
   */
  isDiagPage:boolean =false;
  displayedColumns = [ 'uuid' ,   'Name',   'Price', 'Stocks','Rating',   'Actions'];
  dataSource!: ExtentionDataSource  ;
  serviceDatabase!: ProductService  ;
  /**
   *  table 
   */
  uuid!: string; 
  Count: number=0;
  constructor(  public matDialogService: MatDialog,  
                private router: Router ,
                private dataService: ProductService) 
  {
  }

  ngOnInit(): void {
 
    this.serviceDatabase= this.dataService;
    this.serviceDatabase._count$.subscribe(
      x => {
        this.Count=x;
      },
      err => console.error('Observer got an error: ' + err),
      () => console.log('Observer got a complete notification')
    );

    this.loadData(); 

  }


  /***************************************************************************
  *   edit /add/del 
  ***************************************************************************/
 add()
 {

      this.router.navigate(['admin/products/add'])
 }

 edit(elm: IProduct)
 {

      this.router.navigate(['admin/products/edit',  elm.uuid])
 
   
 }

 del(elm: IProduct)
 {

      this.router.navigate(['admin/products/del',  elm.uuid])
 
   
 }

 
 /***************************************************************************
  *   
  ***************************************************************************/
  reload() {
    this.loadData();
 
  }

private refreshTable() {
  this.loadData();
  this.paginator._changePageSize(this.paginator.pageSize);

}

public loadData() {
  
  this.dataSource = new ExtentionDataSource(this.serviceDatabase, this.paginator, this.sort);
  this.dataSource.connect();
  fromEvent(this.filter.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
}
public  getCount () 
{
   if(this.Count>1000)
   {
     return  (this.Count/1000) +"k"

   }
   return this.Count;
}

}


 

