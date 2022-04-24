using Microsoft.EntityFrameworkCore;
using Enima_Api.Helpers;
 
using Enima_Api.Requests;
using Enima_Api.Responses;
using Enima_Api.Services.Interfaces;
using Repository.Core.Models;
 
using Repository.EFCore;
using Repository.Core.Interfaces;
using Repository.EFCore.Repositories;

namespace Enima_Api.Services
{
    public class TokenService : ITokenService
    {
        
        private readonly AppDbContext _context;
 
        private readonly IBaseRepository<RefreshToken, Guid> _repository;
        public TokenService(AppDbContext context)
        {
            this._context = context;
            _repository = new BaseRepository<RefreshToken>(_context);
        }

        public async Task<Tuple<string, string>> GenerateTokensAsync(Guid userId)
        {
            var accessToken = await TokenHelper.GenerateAccessToken(userId);
            var refreshToken = await TokenHelper.GenerateRefreshToken();

            var userRecord = await _context.Users.Include(o => o.RefreshTokens).FirstOrDefaultAsync(e => e.uuid == userId);

            if (userRecord == null)
            {
                return null;
            }

            var salt = PasswordHelper.GetSecureSalt();

            var refreshTokenHashed = PasswordHelper.HashUsingPbkdf2(refreshToken, salt);

            if (userRecord.RefreshTokens != null && userRecord.RefreshTokens.Any())
            {
                await RemoveRefreshTokenAsync(userRecord);

            }

            DateTime now = DateTime.Now;
            var _refreshToken  = new RefreshToken
            {
                ExpiryDate = now.AddSeconds(45),
                Ts = now,
                UserId = userId,
                TokenHash = refreshTokenHashed,
                TokenSalt = Convert.ToBase64String(salt)

            };

            userRecord.RefreshTokens?.Add(_refreshToken);
            _context.RefreshTokens.Add(_refreshToken);

            var  Response = await _context.SaveChangesAsync();
            if (Response >= 0)
            {
                var tokena = new Tuple<string, string>(accessToken, refreshToken);
                return tokena;
            }

            var token = new Tuple<string, string>("", "");
            return token;

        }

        public async Task<bool> RemoveRefreshTokenAsync(User user)
        {
            var userRecord = await _context.Users.Include(o => o.RefreshTokens).FirstOrDefaultAsync(e => e.uuid == user.uuid);

            if (userRecord == null)
            {
                return false;
            }

            if (userRecord.RefreshTokens != null && userRecord.RefreshTokens.Any())
            {
                var currentRefreshToken = userRecord.RefreshTokens.First();

                _context.RefreshTokens.Remove(currentRefreshToken);
            }

            return false;
        }

        public async Task<ValidateRefreshTokenResp> ValidateRefreshTokenAsync(RefreshTokenReq refreshTokenRequest)
        {
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(o => o.UserId == refreshTokenRequest.UserId);

            var response = new ValidateRefreshTokenResp();
            if (refreshToken == null)
            {
                response.Success = false;
                response.Error = "Invalid session or user is already logged out";
                response.ErrorCode = "invalid_grant";
                return response;
            }

            var refreshTokenToValidateHash = PasswordHelper.HashUsingPbkdf2(refreshTokenRequest.RefreshToken, Convert.FromBase64String(refreshToken.TokenSalt));

            if (refreshToken.TokenHash != refreshTokenToValidateHash)
            {
                response.Success = false;
                response.Error = "Invalid refresh token";
                response.ErrorCode = "invalid_grant";
                return response;
            }
          
            if (refreshToken.ExpiryDate < DateTime.Now)
            {
                response.Success = false;
                response.Error = "Refresh token has expired";
                response.ErrorCode = "invalid_grant";
                return response;
            }

            response.Success = true;
            response.UserId = refreshToken.UserId;

            return response;
        }

 
      
    }
}
