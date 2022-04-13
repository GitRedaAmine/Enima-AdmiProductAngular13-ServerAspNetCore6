using Repository.Core.Interfaces;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.EFCore.Repositories
{
    public class OnlyTestRepository : BaseRepository<OnlyTest>, IOnlyTestRepository
    {
        

        public OnlyTestRepository(ApplicationDbContext context) : base(context)
        {
        }

        public IEnumerable<OnlyTest> SpecialMethod()
        {
            throw new NotImplementedException();
        }
    }

 
}