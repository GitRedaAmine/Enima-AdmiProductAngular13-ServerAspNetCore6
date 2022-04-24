
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Repository.Core.Models;

 
public   class RefreshToken : BaseEntity
{
 

    public string TokenHash { get; set; }
    public string TokenSalt { get; set; }
    public DateTime Ts { get; set; }
    public DateTime ExpiryDate { get; set; }
    public Guid UserId { get; set; }
    public   User User { get; set; }
}
 