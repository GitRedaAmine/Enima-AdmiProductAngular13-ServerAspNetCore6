using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using Repository.Core;
using Repository.Core.Consts;
using Repository.Core.Interfaces;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using AutoMapper;

using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.StaticFiles;
 
using Firebase.Auth;
using Firebase.Storage;

namespace Enima_Api.Services
{
    public class FirebaseUploadFile : IFileUploadService
    {
        private string ApiKey                  =string.Empty;  
        private string Bucket                  =string.Empty;  
        private string AuthEmail               =string.Empty;  
        private string AuthPassword            =string.Empty;  
        private string FirebaseFolder          =string.Empty;  
        private string FirebaseFolderProduct   =string.Empty;  
        private readonly IConfiguration Configuration;

        public FirebaseUploadFile(IConfiguration configuration)
        {
            Configuration = configuration;
            OnInit();
        }
        public  void OnInit()
        {
 
            ApiKey = Configuration["firebase:apiKey"];
            Bucket = Configuration["firebase:Bucket"];
            AuthEmail = Configuration["firebase:AuthEmail"];
            AuthPassword= Configuration["firebase:AuthPassword"];
            FirebaseFolder = Configuration["firebase:FirebaseFolder"];
            FirebaseFolderProduct = Configuration["firebase:FirebaseFolderProduct"];
        }
        public async Task<string> UploadFileAsync(string Filesfolder, string fileName, IFormFile file)
        {
            string FileLinkFromFirebaseStorage = string.Empty; ;
            try
            {
                if (file == null
                  || Filesfolder == string.Empty
                  || fileName == string.Empty)
                    return "errior";

                FileStream fs = null;

                if (file.Length > 0)
                {
                    var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), IFileUploadService.StaticFolder, Filesfolder);
                    if (!Directory.Exists(uploadsDir))
                        Directory.CreateDirectory(uploadsDir);

                    using (var memoyrStream = new FileStream(Path.Combine(uploadsDir, fileName), FileMode.Create))
                    {
                        await file.CopyToAsync(memoyrStream);
                    }

                    var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                    var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);


                    using (fs = new FileStream(Path.Combine(uploadsDir, fileName), FileMode.Open))
                    {
                        var mycancellation = new CancellationTokenSource();
                        var upload = new FirebaseStorage(
                              Bucket,
                               new FirebaseStorageOptions
                               {
                                   AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                                   ThrowOnCancel = true
                               })
                                .Child(FirebaseFolder)
                                .Child(FirebaseFolderProduct)
                                .Child(Filesfolder)
                                .Child(fileName)
                            
                               .PutAsync(fs, mycancellation.Token);
                        upload.Progress.ProgressChanged += (s, e) => Console.WriteLine($"Progress: {e.Percentage} %");
                        // error during upload will be thrown when await the task
                        try
                        {
                            FileLinkFromFirebaseStorage = await upload;
                            fs.Close();
                            DeleteDirectory(uploadsDir,true);
                            //System.IO.File.Delete(Path.Combine(uploadsDir, fileName)); 
                        }
                        catch (Exception ex)
                        {
                            var error = $"Exception was thrown: {ex}";
                        }
                    }

                }

                return FileLinkFromFirebaseStorage;

            }
            catch (Exception ex)
            {
                var error = $"Exception was thrown: {ex}";
                return FileLinkFromFirebaseStorage;
            }
        }



        public async Task<bool> DeleteFileAsync(string Filesfolder, string fileName )
        {
            try
            {
                if ( Filesfolder == string.Empty|| fileName == string.Empty)
                    return false;

                var auth = new FirebaseAuthProvider(new FirebaseConfig(ApiKey));
                var a = await auth.SignInWithEmailAndPasswordAsync(AuthEmail, AuthPassword);
                var mycancellation = new CancellationTokenSource();
                var upload = new FirebaseStorage(
                            Bucket,
                            new FirebaseStorageOptions
                            {
                                AuthTokenAsyncFactory = () => Task.FromResult(a.FirebaseToken),
                                ThrowOnCancel = true
                            })
                        .Child(FirebaseFolder)
                        .Child(FirebaseFolderProduct)
                        .Child(Filesfolder)
                        .Child(fileName);

                 await upload.DeleteAsync();
                return true; 

            }
            catch (Exception ex)
            {
                var error = $"Exception was thrown: {ex}";
                return false;
            }
        }


        private void Progress_ProgressChanged(object? sender, FirebaseStorageProgress e)
        {
            Console.WriteLine($"Progress: {e.Percentage} %");
        }

        public Task<string> UploadFileProgressAsync( string folderName, string fileName, IFormFile file)
        {
            throw new NotImplementedException();
        }


 
        private void DeleteDirectory(string directoryName, bool checkDirectiryExist)
        {
            if (Directory.Exists(directoryName))
                Directory.Delete(directoryName, true);
            else if (checkDirectiryExist)
                throw new SystemException("Directory you want to delete is not exist");
        }

    }




 
}
