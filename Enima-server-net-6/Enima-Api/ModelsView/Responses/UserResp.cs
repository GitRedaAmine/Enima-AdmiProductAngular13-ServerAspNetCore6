namespace Enima_Api.Responses
{
    public class UserResp : BaseResp
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
