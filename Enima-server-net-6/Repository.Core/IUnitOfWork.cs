using Repository.Core.Interfaces;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Core
{



    public interface IUnitOfWork : IDisposable
    {
        IBaseRepository<Product, Guid> Product  { get; }
        IBaseRepository<Brand, Guid> Brand { get; }
        IBaseRepository<Categorie, Guid> Categorie { get; }
        IBaseRepository<ImageUrl, Guid> ImageUrl { get; }

        IOnlyTestRepository OnlyTest { get; }


    

        int Complete();
        Task<int> CompleteAsyn();
    }
}