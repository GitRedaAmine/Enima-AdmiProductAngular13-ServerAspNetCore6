import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
 
import { BaseHttpService } from './base-http.service';
 

@Injectable({
  providedIn: 'root'
})
export class DataHttpService<T, ID> extends BaseHttpService<T, ID> {

  dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  dialogData: any;
 
 
  private _count = new BehaviorSubject<number>(0); // true is your initial value
  _count$ = this._count.asObservable();

  private set Count(value: number) {
    this._count.next(value);
   
  }

  private get Count():number {
    return this._count.getValue()
  }

  constructor(protected override _http: HttpClient, 
              @Inject(String) protected override _Linkbase: string ) {
    super(_http, _Linkbase );
  }
 
  get data(): T[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  get_elms(): void {

    this.GetAll().subscribe(data => {
        this.dataChange.next(data);
        this.Count= data.length ;
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  } 
  // ADD, POST METHOD
  add_elm(elm: T): void {
    this.Add(elm).subscribe(data => {
        console.log (data);
        this.dialogData = data; 
      },
      (err: HttpErrorResponse) => {
        console.log (err.name + ' ' + err.message);
    });
  }

  update_elm(uuid:ID, elm: T): void {
    this.Update(uuid,elm).subscribe(data => {
      this.dialogData =data;
    },
    (err: HttpErrorResponse) => {
    console.log (err.name + ' ' + err.message);
    });
  }
  del_elm(uuid: ID): void {
    this.Delete(uuid).subscribe(data => {  
      },
      (err: HttpErrorResponse) => {
        console.log (err.name + ' ' + err.message);
        }
    );
  }


}

