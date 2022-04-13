namespace Repository.Core.Models
{
    public class Categorie : BaseEntity
    {
        public string Name { get; set; }


        public ICollection<Product> Products { get; set; }

    }

}