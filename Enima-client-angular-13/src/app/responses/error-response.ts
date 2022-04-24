export interface ErrorResponse {
    errorCode: string;
    error:string;

}

export interface SignupResponse  extends  ErrorResponse {
    email: string;
 
}
