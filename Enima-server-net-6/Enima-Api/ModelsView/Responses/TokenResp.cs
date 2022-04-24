using System.Text.Json.Serialization;

namespace Enima_Api.Responses
{
    public class TokenResp : BaseResp
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Guid UserId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string FirstName { get; set; }

    }
}
