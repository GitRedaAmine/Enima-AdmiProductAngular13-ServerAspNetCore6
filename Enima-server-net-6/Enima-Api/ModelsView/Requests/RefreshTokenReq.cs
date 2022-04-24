namespace Enima_Api.Requests
{
    public class RefreshTokenReq
    {
        public Guid UserId { get; set; }
        public string RefreshToken { get; set; }

    }
}
