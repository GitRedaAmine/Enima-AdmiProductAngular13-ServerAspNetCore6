import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { BehaviorSubject, map, merge, Observable } from "rxjs";
import { IProduct } from "src/app/shared/models/api/iproduct.model";
import { ProductService } from "src/app/shared/services/api/product.service";
 





export class  ExtentionDataSource extends DataSource<IProduct> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: IProduct[] = [];
  renderedData: IProduct[] = [];

  constructor(public _serviceDatabase: ProductService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<IProduct[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._serviceDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._serviceDatabase.get_elms();
    

    return merge(...displayDataChanges).pipe(map( () => {
        // Filter data
        this.filteredData = this._serviceDatabase.data.slice().filter((elm: IProduct) => {
          if(elm !=null){
          
          const searchStr =  (  elm.name +  
            elm.price + elm.stocks + elm.rating ). toString().toLowerCase();  
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          }
          return false; 
        });

        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());

        // Grab the page's slice of the filtered sorted data.
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: IProduct[]): IProduct[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      let propertyBBoolean: boolean = true;
      let propertyABoolean: boolean = true;

      switch (this._sort.active) {
        case 'uuid': [propertyA, propertyB] = [a.uuid, b.uuid]; break;
        case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'price': [propertyA, propertyB] = [a.price, b.price]; break;
        case 'stocks': [propertyA, propertyB] = [a.stocks, b.stocks]; break;
        case 'rating': [propertyA, propertyB] = [a.rating, b.rating]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}