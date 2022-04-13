 

namespace Repository.Core.Models
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal Rating { get; set; }
        public int Stocks { get; set; }

        public ICollection<ImageUrl> ImageUrls { get; set; }

        public Brand Brand { get; set; }
        public Guid BrandId { get; set; }


        public Categorie Categorie { get; set; }
        public Guid CategorieId { get; set; }


    }


}