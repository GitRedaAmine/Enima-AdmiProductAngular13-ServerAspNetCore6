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
using Enima_Api.Models;

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
 

        [HttpPost("add")]
        public async Task<IActionResult> UploadNew([FromForm] UploadReq model)
        {
            try
            {
                if (model == null
                || model.folderName == string.Empty)
                {
                    UploadResp respErr= new UploadResp();
                    respErr.status = false;
                    respErr.msg = "folderName is empty...";
                    return Ok(respErr);

                }

                string fileName = Guid.NewGuid().ToString()+".jpg";
                UploadResp resp = await _uploadService.UploadFileAsync(model.folderName, fileName, model.file);
                resp.fileName = fileName;
                return Ok(resp);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost("update")]
        public async Task<IActionResult> UploadUpdate([FromForm] UploadReq model)
        {
            try
            {
                UploadResp respErr = new UploadResp();
                if (model == null || model.fileName == string.Empty 
                || model.folderName == string.Empty)
                {
                       
                        respErr.status = false;
                        respErr.msg = "folderName or filename is empty";
                        return Ok(respErr);

                }
                if (await _uploadService.DeleteFileAsync(model.folderName, model.fileName)) {

                  
                    UploadResp resp = await _uploadService.UploadFileAsync(model.folderName, model.fileName, model.file);
                    resp.fileName = model.fileName;
                    return Ok(resp);

                }
                else
                {
                    respErr.status = false;
                    respErr.msg = "error delete file " + model.fileName + " from directory " + model.folderName;
                    return Ok(respErr);
                }

               
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpDelete("delete")]
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
