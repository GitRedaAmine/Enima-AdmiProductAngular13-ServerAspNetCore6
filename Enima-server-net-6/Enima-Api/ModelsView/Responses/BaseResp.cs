using System.Text.Json.Serialization;

namespace Enima_Api.Responses
{
    public abstract class BaseResp
    {
        [JsonIgnore()]
        public bool Success { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string ErrorCode { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Error { get; set; }
    }

}
