using Repository.Core;
using Repository.Core.Interfaces;
using Repository.Core.Models;
using Repository.EFCore.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Repository.EFCore
{

 

    public class UnitOfWork  : IUnitOfWork 
    {
        private readonly AppDbContext _context;

        public IBaseRepository<Product, Guid> Product { get; private set; }
        public IBaseRepository<Brand, Guid> Brand { get; private set; }
        public IBaseRepository<Categorie, Guid> Categorie { get; private set; }
        public IBaseRepository<ImageUrl, Guid> ImageUrl { get; private set; }

        public IBaseRepository<User, Guid> User { get; private set; }
        public IBaseRepository<RefreshToken, Guid> RefreshToken { get; private set; }


        public UnitOfWork(AppDbContext context)
        {
            _context = context;

            Product = new BaseRepository<Product>(_context);
            Brand = new BaseRepository<Brand>(_context);
            Categorie = new BaseRepository<Categorie>(_context);
            ImageUrl = new BaseRepository<ImageUrl>(_context);


            User = new BaseRepository<User>(_context);
            RefreshToken = new BaseRepository<RefreshToken>(_context);
        }

        public AppDbContext context()
        {
            return _context;
        }


        public int Complete()
        {
            return _context.SaveChanges();
        }


        public async Task<int> CompleteAsyn()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}