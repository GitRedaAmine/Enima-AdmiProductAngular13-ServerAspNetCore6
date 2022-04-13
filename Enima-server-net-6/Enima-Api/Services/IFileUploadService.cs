using Firebase.Auth;

namespace Enima_Api.Services
{
    public interface IFileUploadService
    {
        static string StaticFolder = "StaticFiles";
        Task<string> UploadFileAsync( string Filesfolder, string fileName, IFormFile file);
        Task<bool> DeleteFileAsync(string Filesfolder, string fileName);
        Task<string> UploadFileProgressAsync(  string Filesfolder, string fileName, IFormFile file);

    }
}
