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


namespace Enima_Api.Services
{
    public class LocalUploadFile : IFileUploadService
    {

        public async Task<string> UploadFileAsync( string Filesfolder, string fileName,  IFormFile file)
        {
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), IFileUploadService.StaticFolder, Filesfolder);
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            var path = Path.Combine(uploadsDir, fileName);
           

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return path;
        }

        public async  Task<string> UploadFileProgressAsync(  string Filesfolder, string fileName, IFormFile file)
        {
            string ret = String.Empty;
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), IFileUploadService.StaticFolder, Filesfolder);
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);



            if (file.Length > 0) {


               // string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                var path = Path.Combine(uploadsDir, fileName);


                var buffer = 1024 * 1024;
                using var stream = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, buffer, useAsync: false);
                await file.CopyToAsync(stream);
                await stream.FlushAsync();

                ret =  "{folderStaticFile }/{folderName}/{fileName}"; 
            }
             
           return ret;
       }

        public async Task<bool> DeleteFileAsync(string Filesfolder, string fileName)
        {
            throw new NotImplementedException();
        }
    }
}
