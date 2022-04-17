using Enima_Api.Models;
using Firebase.Auth;

namespace Enima_Api.Services
{
    public interface IFileUploadService
    {
        static string StaticFolder = "StaticFiles";
        Task<UploadResp> UploadFileAsync( string Filesfolder, string fileName, IFormFile file);
        Task<bool> DeleteFileAsync(string Filesfolder, string fileName);
   

    }
}
