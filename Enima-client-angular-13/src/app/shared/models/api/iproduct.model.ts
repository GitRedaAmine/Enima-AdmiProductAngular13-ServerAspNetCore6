
export interface IImage  {
    url     :string  ,
    name :string
}

 
export interface IImageUrl
{
 
    uuid?:string,
    name? :string,
    url? :string,
    productId? :string,

}


export interface IProduct  
{
    uuid?:string,
    name :string,
    description :string,
    price :number,
    rating :number,
    stocks :number,
    brandId:string,
    categorieId:string,
}



export interface IFileUploadReq
{
     folderName:string  ,
     fileName:string  ,
     file :File,
}


export interface IFileUploadResp
{
     folderName:string  ,
     fileName:string  ,
     url:string  ,
}



export interface IFileDelReq
{
     folderName:string  ,
     fileName:string  ,

    
}

export interface IFileDelResp
{

     status:boolean  ,
     msg:string  ,

}
