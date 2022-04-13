using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Core.Interfaces
{
    public interface IOnlyTestRepository : IBaseRepository<OnlyTest,Guid>
    {
        IEnumerable<OnlyTest> SpecialMethod();
    }


    
}