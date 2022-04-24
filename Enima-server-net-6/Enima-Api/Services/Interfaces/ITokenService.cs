using Enima_Api.Requests;
using Enima_Api.Responses;
using Repository.Core.Models;
 

namespace Enima_Api.Services.Interfaces
{
    public interface ITokenService
    {
        Task<Tuple<string, string>> GenerateTokensAsync(Guid userId);
        Task<ValidateRefreshTokenResp> ValidateRefreshTokenAsync(RefreshTokenReq refreshTokenRequest);
        Task<bool> RemoveRefreshTokenAsync(User user);
    }
}
