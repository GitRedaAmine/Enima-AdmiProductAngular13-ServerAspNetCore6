using Microsoft.EntityFrameworkCore;
using Enima_Api.Helpers;
 
using Enima_Api.Requests;
using Enima_Api.Responses;
using Enima_Api.Services.Interfaces;
using Repository.EFCore;
using Repository.Core.Models;

namespace Enima_Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext tasksDbContext;
        private readonly ITokenService tokenService;

        public UserService(AppDbContext tasksDbContext, ITokenService tokenService)
        {
            this.tasksDbContext = tasksDbContext;
            this.tokenService = tokenService;
        }

        public async Task<UserResp> GetInfoAsync(Guid userId)
        {
            var user = await tasksDbContext.Users.FindAsync(userId);

            if (user == null)
            {
                return new UserResp
                {
                    Success = false,
                    Error = "No user found",
                    ErrorCode = "I001"
                };
            }

            return new UserResp
            {
                Success = true,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreationDate = user.Ts
            };
        }

        public async Task<TokenResp> LoginAsync(LoginReq loginRequest)
        {
            var user = tasksDbContext.Users.SingleOrDefault(user => user.Active && user.Email == loginRequest.Email);

            if (user == null)
            {
                return new TokenResp
                {
                    Success = false,
                    Error = "Email not found",
                    ErrorCode = "L02"
                };
            }
            var passwordHash = PasswordHelper.HashUsingPbkdf2(loginRequest.Password, Convert.FromBase64String(user.PasswordSalt));

            if (user.PasswordHash != passwordHash)
            {
                return new TokenResp
                {
                    Success = false,
                    Error = "Invalid Password",
                    ErrorCode = "L03"
                };
            }

            var token = await System.Threading.Tasks.Task.Run(() => tokenService.GenerateTokensAsync((Guid)user.uuid));

            return new TokenResp
            {
                Success = true,
                AccessToken = token.Item1,
                RefreshToken = token.Item2,
                UserId = (Guid)user.uuid,
                FirstName = user.FirstName
            };
        }

        public async Task<LogoutResp> LogoutAsync(Guid userId)
        {
            var refreshToken = await tasksDbContext.RefreshTokens.FirstOrDefaultAsync(o => o.UserId == userId);

            if (refreshToken == null)
            {
                return new LogoutResp { Success = true };
            }

            tasksDbContext.RefreshTokens.Remove(refreshToken);

            var saveResponse = await tasksDbContext.SaveChangesAsync();

            if (saveResponse >= 0)
            {
                return new LogoutResp { Success = true };
            }

            return new LogoutResp { Success = false, Error = "Unable to logout user", ErrorCode = "L04" };

        }

        public async Task<SignupResp> SignupAsync(SignupReq signupRequest)
        {
            var existingUser = await tasksDbContext.Users.SingleOrDefaultAsync(user => user.Email == signupRequest.Email);

            if (existingUser != null)
            {
                return new SignupResp
                {
                    Success = false,
                    Error = "User already exists with the same email",
                    ErrorCode = "S02"
                };
            }

            if (signupRequest.Password != signupRequest.ConfirmPassword) {
                return new SignupResp
                {
                    Success = false,
                    Error = "Password and confirm password do not match",
                    ErrorCode = "S03"
                };
            }

            if (signupRequest.Password.Length <= 7) // This can be more complicated than only length, you can check on alphanumeric and or special characters
            {
                return new SignupResp
                {
                    Success = false,
                    Error = "Password is weak",
                    ErrorCode = "S04"
                };
            }

            var salt = PasswordHelper.GetSecureSalt();
            var passwordHash = PasswordHelper.HashUsingPbkdf2(signupRequest.Password, salt);

            var user = new User
            {
                Email = signupRequest.Email,

                Password  = signupRequest.Password,
                PasswordHash = passwordHash,
                PasswordSalt = Convert.ToBase64String(salt),
                FirstName = signupRequest.FirstName,
                LastName = signupRequest.LastName,
                Ts = signupRequest.Ts,
                Active = true // You can save is false and send confirmation email to the user, then once the user confirms the email you can make it true
            };

            await tasksDbContext.Users.AddAsync(user);

            var saveResponse = await tasksDbContext.SaveChangesAsync();

            if (saveResponse >= 0)
            {
                return new SignupResp { Success = true, Email = user.Email };
            }

            return new SignupResp
            {
                Success = false,
                Error = "Unable to save the user",
                ErrorCode = "S05"
            };

        }

   
    }
}