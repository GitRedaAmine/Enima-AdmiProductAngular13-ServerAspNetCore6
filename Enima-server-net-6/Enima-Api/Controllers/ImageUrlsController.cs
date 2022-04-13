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
using Enima_Api.DTO;
using Enima_Api.Services;

namespace Enima_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUrlsController : ControllerBase
    {
        // private readonly IUnitOfWork _unitOfWork;
        private readonly IBaseRepository<ImageUrl, Guid> _repository;
        private readonly IMapper _mapper;
 

        public ImageUrlsController(
            IBaseRepository<ImageUrl, Guid> repository,
            IMapper mapper
            )
        {
            _repository = repository;
            _mapper = mapper;
        }



        // GET: api/<ImageUrlsController>
        [HttpGet("getAll")]
        public async Task<IEnumerable<ImageUrlDTO>> GetImageUrls()
        {
            try
            {
                var items = await _repository.GetAllAsync();
                var itemsDtos = _mapper.Map<List<ImageUrlDTO>>(items);
                return itemsDtos;

            }
            catch (Exception e)
            {
                return (IEnumerable<ImageUrlDTO>)BadRequest(e.Message);
            }
        }


        // GET: api/<ImageUrlsController>
        [HttpGet("getAllByProductId/{uuid}")]
        public async Task<IEnumerable<ImageUrlDTO>> GetImageUrlsByIdProduct(Guid uuid)
        {
            try
            {

                var items = await _repository.FindAllAsync(x => x.ProductId.Equals(uuid));
                var itemsDtos = _mapper.Map<List<ImageUrlDTO>>(items);
                return itemsDtos;

            }
            catch (Exception e)
            {
                return (IEnumerable<ImageUrlDTO>)BadRequest(e.Message);
            }
        }


        // GET api/<ImageUrlsController>/5
        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var item = await _repository.GetByIdAsync(id);

                if (item == null)
                {
                    return NotFound();
                }
                var itemsDto = _mapper.Map<ImageUrlDTO>(item);
                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpGet("GetByUrl")]
        public IActionResult GetByUrl(string url)
        {
            try
            {
                var item = _repository.Find(b => b.Url == url);
                if (item == null)
                {
                    return NotFound();
                }
                var itemsDto = _mapper.Map<ImageUrlDTO>(item);

                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpPost("add")]
        public async Task<IActionResult> Create( ImageUrlDTO itemDTO)
        {
            try
            {
                if (itemDTO == null  
                  || itemDTO.Name == string.Empty
                  || itemDTO.ProductId ==Guid.Empty
                  || itemDTO.Url == string.Empty)
                    return Content("ImageUrlDTO not selected");
                ImageUrl item = _mapper.Map<ImageUrl>(itemDTO);
                await _repository.AddAsync(item);
                await _repository.CompleteAsyn();

                ImageUrlDTO Response = _mapper.Map<ImageUrlDTO>(item);
                var uri = "api/ImageUrls/" + Response.uuid;
                return Created(uri, Response);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
            if (itemDTO == null)
            {
                return BadRequest();
            }
        }
 

        // PUT api/<ImageUrlsController>/5
        [HttpPut("put/{id}")]
        public async Task<IActionResult> Update(Guid id,   ImageUrlDTO itemDto)
        {
            try
            {
                if (itemDto == null)
                {
                    return BadRequest();
                }
                var item = await _repository.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }
                ImageUrl data = _mapper.Map<ImageUrl>(itemDto);
                data.uuid =  id;
               
           
                _repository.Update(data);
                await _repository.CompleteAsyn();

                ImageUrlDTO Response = _mapper.Map<ImageUrlDTO>(item);
                var uri = "api/ImageUrls/" + Response.uuid;
                return Created(uri, Response);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // DELETE api/<ImageUrlsController>/5
        [HttpDelete("del/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var item = await _repository.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }
 
                _repository.Delete(item);
                _repository.Complete();
                return Ok( );

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


 
    }
}