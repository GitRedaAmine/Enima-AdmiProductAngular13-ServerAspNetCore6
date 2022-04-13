using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Core;
using Repository.Core.Interfaces;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
 
using AutoMapper;
using Enima_Api.DTO;

namespace Enima_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
 
     public class ProductsController : ControllerBase
    {
        // private readonly IUnitOfWork _unitOfWork;
        private readonly IBaseRepository<Product, Guid> _repository;
        private readonly IMapper _mapper;
        public ProductsController(IBaseRepository<Product, Guid> repository, IMapper mapper)
        {

            _repository = repository;
            _mapper = mapper;
        }



        // GET: api/<ProductsController>
        [HttpGet("GetAll")]
        public async Task<IEnumerable<ProductDTO>> GetProducts()
        {
            try 
            {
                var items = await _repository.GetAllAsync();
                var itemsDtos = _mapper.Map<List<ProductDTO>>(items);
                return itemsDtos;
            } 
            catch(Exception e)
            {
                return (IEnumerable<ProductDTO>)BadRequest(e.Message);

            }
        }


        // GET api/<ProductsController>/5
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
                var itemsDto = _mapper.Map<ProductDTO>(item);
                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }
        }



        [HttpGet("GetByName")]
        public IActionResult GetByName(string name)
        {
            try
            {
                var item = _repository.Find(b => b.Name == name);
                if (item == null)
                {
                    return NotFound();
                }
                var itemsDto = _mapper.Map<ProductDTO>(item);

                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }
        }



        [HttpPost("add")]
        public async Task<IActionResult> Create(ProductDTO itemDTO)
        {
            try
            {
                if (itemDTO == null)
                {
                    return BadRequest();
                }

                Product item = _mapper.Map<Product>(itemDTO);

                await _repository.AddAsync(item);
                await _repository.CompleteAsyn();

                ProductDTO Response = _mapper.Map<ProductDTO>(item);
                var uri = "api/Products/get" + Response.uuid;
                return Created(uri, Response);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }


            // return CreatedAtRoute("GetById", new { Controller = "Products", id = item.Id }, item);
        }


        // PUT api/<ProductsController>/5
        [HttpPut("put/{id}")]
        public async Task<IActionResult> Update(Guid id, ProductDTO itemDto)
        {
            try
            {
                if (itemDto == null)
                {
                    return BadRequest();
                }
               
                var CurrentItem = await _repository.GetByIdAsync(id);
                if (CurrentItem == null)
                {
                    return NotFound();
                }

 
                Product UpdateItem = _mapper.Map<Product>(itemDto);

                _repository.Update(UpdateItem);
                await _repository.CompleteAsyn();

                ProductDTO Response = _mapper.Map<ProductDTO>(UpdateItem);
                var uri = "api/Products/" + Response.uuid;
                return Created(uri, Response);

                // return CreatedAtRoute("GetById", new { Controller = "Products", id = item.Id }, item);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);

            }

        }

        // DELETE api/<ProductsController>/5
        [HttpDelete("del/{id}")]
        public async Task<IActionResult> Delete(  Guid id)
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
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }


           
        }


    }
}