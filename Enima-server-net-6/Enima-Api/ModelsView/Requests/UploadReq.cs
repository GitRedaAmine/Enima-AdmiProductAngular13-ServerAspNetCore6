namespace Enima_Api.Models
{
    public class UploadReq
    {

        public string? folderName { get; set; }
        public string? fileName { get; set; }
        public IFormFile? file    { get; set; } 
    }


}