

using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Core.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
 
        public int Price { get; set; }
 
        public int Rating { get; set; }
        public int Stocks { get; set; }

        public ICollection<ImageUrl> ImageUrls { get; set; }

        public Brand Brand { get; set; }
        public Guid BrandId { get; set; }


        public Categorie Categorie { get; set; }
        public Guid CategorieId { get; set; }


    }


}