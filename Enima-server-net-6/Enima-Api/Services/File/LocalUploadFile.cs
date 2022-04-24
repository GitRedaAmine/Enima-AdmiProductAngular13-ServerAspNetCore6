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
using Enima_Api.Responses;

namespace Enima_Api.Services
{
    public class LocalUploadFile : IFileUploadService
    {

        public async Task<UploadResp> UploadFileAsync( string Filesfolder, string fileName,  IFormFile file)
        {

            UploadResp FileUploadResp = new UploadResp();
            if (file == null
              || Filesfolder == string.Empty
              || fileName == string.Empty)
            {
                FileUploadResp.Success = false;
                FileUploadResp.Error = "Error object data , check filename or foldername and IFormFile ";
                FileUploadResp.ErrorCode = "I001";
                return FileUploadResp;
            }

            FileUploadResp.fileName = fileName;
            FileUploadResp.folderName = Filesfolder;
            try
            {
                var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), IFileUploadService.StaticFolder, Filesfolder);
                if (!Directory.Exists(uploadsDir))
                    Directory.CreateDirectory(uploadsDir);

                var path = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                    FileUploadResp.Success = true;
                    FileUploadResp.Error = " file : " + fileName + " is correctely uploaded in subdirectory ( " + Filesfolder + ")";

                }
            }
            catch (Exception ex)
            {
                FileUploadResp.Success = false;
                FileUploadResp.Error = " error uploading file : " + fileName + " , exception : " + ex.Message;
            }

            

            return FileUploadResp;
        }


        public async Task<bool> DeleteFileAsync(string Filesfolder, string fileName)
        {
            throw new NotImplementedException();
        }















        public async Task<string> UploadFileProgressAsync(string Filesfolder, string fileName, IFormFile file)
        {
            string ret = String.Empty;
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), IFileUploadService.StaticFolder, Filesfolder);
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);



            if (file.Length > 0)
            {


                // string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

                var path = Path.Combine(uploadsDir, fileName);


                var buffer = 1024 * 1024;
                using var stream = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, buffer, useAsync: false);
                await file.CopyToAsync(stream);
                await stream.FlushAsync();

                ret = "{folderStaticFile }/{folderName}/{fileName}";
            }

            return ret;
        }
    }
}
