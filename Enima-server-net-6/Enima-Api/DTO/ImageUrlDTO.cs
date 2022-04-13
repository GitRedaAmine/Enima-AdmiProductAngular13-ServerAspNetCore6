

using Repository.Core.Models;

namespace Enima_Api.DTO
{
    public class ImageUrlDTO : BaseEntity
    {
        public string Name { get; set; }
        public string? Url  { get; set; }
       // public  IFormFile  File  { get; set; }
        public Guid ProductId { get; set; }

    }

}