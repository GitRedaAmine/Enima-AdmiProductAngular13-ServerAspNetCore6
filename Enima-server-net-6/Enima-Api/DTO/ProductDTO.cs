using Repository.Core.Models;

namespace Enima_Api.DTO
{
    public class ProductDTO : BaseEntity
    {
        
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public int Rating { get; set; }
        public int Stocks { get; set; }
        public Guid BrandId { get; set; }
        public Guid CategorieId { get; set; }
     //   public List<string> ImageUrls { get; set; }
    }


}