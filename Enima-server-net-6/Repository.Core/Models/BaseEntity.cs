using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Repository.Core.Models
{
    public class BaseEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid? uuid { get; set; }
      //  public DateTime CreationDate { get; set; }
       // public DateTime? ModificationDate { get; set; }

    }
}