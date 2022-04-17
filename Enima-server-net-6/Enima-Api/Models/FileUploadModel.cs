using Microsoft.AspNetCore.Http;

namespace  Enima_Api.Models
{

    public class FileStsResp
    {
        public bool status { get; set; }
        public string? msg { get; set; }

    }


    public class UploadReq
    {

        public string? folderName { get; set; }
        public string? fileName { get; set; }
        public IFormFile? file    { get; set; } 
    }


    public class UploadResp : FileStsResp
    {
        public string? folderName { get; set; }
        public string? fileName { get; set; }
        public string? url { get; set; }
    }



    public class FileDelReq
    {
        public string? folderName { get; set; }
        public string? fileName { get; set; }
 
        
    }

    public class FileDelResp: FileStsResp
    {
 
    }


}