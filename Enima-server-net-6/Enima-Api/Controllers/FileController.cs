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
using Enima_Api.Services;


namespace Enima_Api.Controllers
{

 
 
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileUploadService _uploadService;
        private readonly IMapper _mapper;
        public FileController( IMapper mapper , IFileUploadService uploadService)
        {
            _mapper = mapper;
            _uploadService = uploadService;
        }
 

        [HttpPost("uploadFireBase")]
        public async Task<IActionResult> UploadFileFireBase([FromForm] FileUploadReq model)
        {
            try
            {
                if (model == null || model.file == null
                    || model.fileName == string.Empty
                    || model.folderName == string.Empty)
                    return Content("file not selected");
 

                
                FileUploadResp resp = new FileUploadResp();
                resp.url = await _uploadService.UploadFileAsync(model.folderName, model.fileName, model.file);
                resp.folderName = model.folderName;
                resp.fileName = model.fileName;

                return Ok(resp);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpDelete("deleteFireBase")]
        public async Task<IActionResult> deleteFireBase( FileDelReq model)
        {
            try
            {
                if (model == null 
                    || model.fileName == string.Empty
                    || model.folderName == string.Empty)
                    return Content("file not selected");

                FileDelResp resp = new FileDelResp();

                 
                resp.status = await _uploadService.DeleteFileAsync(model.folderName, model.fileName);
                resp.msg =  "delete file ok";
               

                if ((bool)!resp.status)
                {
                    resp.msg = " Can not delete image name " + model.fileName + " from directory " + model.folderName + " check if the file exis ";
                     
                }


                return Ok(resp);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

 
    }
}
