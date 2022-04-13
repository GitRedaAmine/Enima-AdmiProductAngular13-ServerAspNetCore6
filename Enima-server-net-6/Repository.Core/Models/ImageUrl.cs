using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
 


namespace Repository.Core.Models
{
    public class ImageUrl : BaseEntity
    {
        public string Name { get; set; }

        public string Url { get; set; }

        public Product Product { get; set; }
        public Guid ProductId { get; set; }
    }

}