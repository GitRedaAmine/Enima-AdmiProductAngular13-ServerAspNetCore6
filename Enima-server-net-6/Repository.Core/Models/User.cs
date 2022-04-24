namespace Repository.Core.Models;

public   class User : BaseEntity
{
    public User()
    {
        RefreshTokens = new HashSet<RefreshToken>();
    
    }
 
    public string Email { get; set; }
    public string Password { get; set; }
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime Ts { get; set; }
    public bool Active { get; set; }

    public  ICollection<RefreshToken> RefreshTokens { get; set; }
 
}