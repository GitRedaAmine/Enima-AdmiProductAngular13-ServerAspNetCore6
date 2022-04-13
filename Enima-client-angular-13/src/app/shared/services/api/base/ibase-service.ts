import { Observable } from "rxjs";

/*
    Path	            Method	        Description
/api/resource	        GET	            Returns a list of bookmarks
/api/resource	        POST	          Creates a new bookmark
/api/resource/:id	    GET	            Get a bookmark by it’s Id
/api/resource/:id	    PUT	            Updates a bookmark by it’s Id
/api/resource/:id	    DELETE	        Deletes a bookmark by it’s Id
*/
export interface IBaseService<T, ID> {
    GetAll(): Observable<T[]>;
    GetById(id: ID): Observable<T>;
    
    Add(t: T): Observable<T>;
    AddJson(t: T): Observable<T>;
  
    Update(id: ID, t: T): Observable<T>;
    Delete(id: ID): Observable<any>;
  }
  