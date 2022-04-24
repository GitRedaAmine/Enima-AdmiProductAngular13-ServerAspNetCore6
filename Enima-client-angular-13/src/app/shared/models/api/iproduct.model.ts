
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


export interface IFileStatusResp
{

     success:boolean  ,
     msg:string  ,

}
export interface IFileAddReq
{
     folderName:string  ,
     file :File,
}

export interface IFileUpdateReq extends IFileAddReq 
{
     fileName:string,
     uuid:string ,
}

export interface IFileUploadResp extends IFileStatusResp 
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

export interface IFileDelResp extends IFileStatusResp 
{

 

}
