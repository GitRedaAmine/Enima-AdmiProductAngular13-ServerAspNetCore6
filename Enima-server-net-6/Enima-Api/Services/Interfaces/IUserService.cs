using Enima_Api.Requests;
using Enima_Api.Responses;

namespace Enima_Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<TokenResp> LoginAsync(LoginReq loginRequest);
        Task<SignupResp> SignupAsync(SignupReq signupRequest);

        Task<LogoutResp> LogoutAsync(Guid userId);
        Task<UserResp> GetInfoAsync(Guid userId);
    }
}
