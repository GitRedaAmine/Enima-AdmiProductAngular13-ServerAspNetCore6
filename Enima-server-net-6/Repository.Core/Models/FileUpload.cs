using Microsoft.AspNetCore.Http;

namespace Repository.Core.Models
{
    public class FileUploadReq
    {

        public string? folderName { get; set; }
        public string? fileName   { get; set; }
        public IFormFile? file    { get; set; } 
    }


    public class FileUploadResp
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

    public class FileDelResp
    {

        public bool status { get; set; }
        public string? msg { get; set; }

    }


}