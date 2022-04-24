using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repository.Core;
using Repository.Core.Consts;
using Repository.Core.Interfaces;
using Repository.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using AutoMapper;
using Enima_Api.DTO;
using Enima_Api.Services.Interfaces;
using Enima_Api.Requests;
using Enima_Api.Responses;
using Microsoft.AspNetCore.Authorization;

namespace Enima_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : BaseController
    {
        private readonly IUserService userService;
        private readonly ITokenService tokenService;

        public UsersController(IUserService userService, ITokenService tokenService)
        {
            this.userService = userService;
            this.tokenService = tokenService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginReq loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest(new TokenResp
                {
                    Error = "Missing login details",
                    ErrorCode = "L01"
                });
            }

            var loginResponse = await userService.LoginAsync(loginRequest);

            if (!loginResponse.Success)
            {
                return Unauthorized(new
                {
                    loginResponse.ErrorCode,
                    loginResponse.Error
                });
            }

            return Ok(loginResponse);
        }

        [HttpPost]
        [Route("refresh_token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenReq refreshTokenRequest)
        {
            if (refreshTokenRequest == null || string.IsNullOrEmpty(refreshTokenRequest.RefreshToken) || refreshTokenRequest.UserId ==Guid.Empty)
            {
                return BadRequest(new TokenResp
                {
                    Error = "Missing refresh token details",
                    ErrorCode = "R01"
                });
            }

            var validateRefreshTokenResponse = await tokenService.ValidateRefreshTokenAsync(refreshTokenRequest);

            if (!validateRefreshTokenResponse.Success)
            {
                return BadRequest(validateRefreshTokenResponse);
            }

            var tokenResponse = await tokenService.GenerateTokensAsync(validateRefreshTokenResponse.UserId);

            return Ok(new TokenResp { AccessToken = tokenResponse.Item1, RefreshToken = tokenResponse.Item2 });
        }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> Signup(SignupReq signupRequest)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(x => x.Errors.Select(c => c.ErrorMessage)).ToList();
                if (errors.Any())
                {
                    return BadRequest(new TokenResp
                    {
                        Error = $"{string.Join(",", errors)}",
                        ErrorCode = "S01"
                    });
                }
            }
         
            var signupResponse = await userService.SignupAsync(signupRequest);

            if (!signupResponse.Success)
            {
                return UnprocessableEntity(
                    new SignupResp
                    {
                        Error = signupResponse.Error,
                        ErrorCode = signupResponse.ErrorCode
                    }
                    );
            }

            return Ok(signupResponse.Email);
        }

        [Authorize]
        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout()
        {
            var logout = await userService.LogoutAsync(UserID);

            if (!logout.Success)
            {
                return UnprocessableEntity(logout);
            }

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [Route("info")]
        public async Task<IActionResult> Info()
        {
            var userResponse = await userService.GetInfoAsync(UserID);
         

            if (!userResponse.Success)
            {
                return UnprocessableEntity(userResponse);
            }

            return Ok(userResponse);

        }
    }
}
