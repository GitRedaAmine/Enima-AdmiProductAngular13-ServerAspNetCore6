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
namespace Enima_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
 
     public class CategoriesController : ControllerBase
    {
        // private readonly IUnitOfWork _unitOfWork;
        private readonly IBaseRepository<Categorie, Guid> _repository;
        private readonly IMapper _mapper;
        public CategoriesController(IBaseRepository<Categorie, Guid> repository, IMapper mapper)
        {
 
            _repository = repository;
            _mapper = mapper;
        }



        // GET: api/<BrandsController>
        [HttpGet("getAll")]
        public async Task<IEnumerable<CategorieDTO>> GetBrands()
        {
            try
            {

                var items = await _repository.GetAllAsync();
                var itemsDtos = _mapper.Map<List<CategorieDTO>>(items);
                return itemsDtos;

            }
            catch (Exception e)
            {
                return (IEnumerable<CategorieDTO>)BadRequest(e.Message);
            }
        }


        // GET api/<BrandsController>/5
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
                var itemsDto = _mapper.Map<CategorieDTO>(item);
                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpGet("getByName")]
        public IActionResult GetByName(string name)
        {
            try
            {
                var item = _repository.Find(b => b.Name == name);
                if (item == null)
                {
                    return NotFound();
                }
                var itemsDto = _mapper.Map<CategorieDTO>(item);

                return Ok(itemsDto);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }



        [HttpPost("add")]
        public async Task<IActionResult> Create(CategorieDTO itemDTO)
        {
            try
            {
                if (itemDTO == null)
                {
                    return BadRequest();
                }

                Categorie item = _mapper.Map<Categorie>(itemDTO);

                await _repository.AddAsync(item);
                await _repository.CompleteAsyn();

                CategorieDTO Response = _mapper.Map<CategorieDTO>(item);
                var uri = "api/Categories/" + Response.uuid;
                return Created(uri, Response);


                // return CreatedAtRoute("GetById", new { Controller = "Brands", id = item.Id }, item);

            }
            catch (Exception e)
            {
#pragma warning disable CS8602 // Déréférencement d'une éventuelle référence null.
                return BadRequest(error: e.Message + "  ERROR" + e.InnerException.Message);
#pragma warning restore CS8602 // Déréférencement d'une éventuelle référence null.
            }
        }


        // PUT api/<BrandsController>/5
        [HttpPut("put/{id}")]
        public async Task<IActionResult> Update(Guid id, CategorieDTO itemDto)
        {
            try
            {
                if (itemDto == null)
                {
                    return BadRequest();
                }
                Categorie data = _mapper.Map<Categorie>(itemDto);
                var item = await _repository.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound();
                }

                _repository.Update(data);
                await _repository.CompleteAsyn();

                CategorieDTO Response = _mapper.Map<CategorieDTO>(item);
                var uri = "api/Categories/" + Response.uuid;
                return Created(uri, Response);

                // return CreatedAtRoute("GetById", new { Controller = "Brands", id = item.Id }, item);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // DELETE api/<BrandsController>/5
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

                return Ok();

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


    }
}