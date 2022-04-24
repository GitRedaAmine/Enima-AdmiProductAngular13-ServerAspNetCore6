using System.ComponentModel.DataAnnotations;

namespace Enima_Api.Requests
{
    public class SignupReq
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string ConfirmPassword { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public DateTime Ts { get; set; }

    }
}
