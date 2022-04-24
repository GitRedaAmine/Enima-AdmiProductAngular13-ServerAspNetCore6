namespace Enima_Api.Controllers;

using Microsoft.AspNetCore.Mvc;
using Repository.Core.Models;
 
using System.Security.Claims;

[Controller]
public abstract class BaseController : ControllerBase
{
    protected Guid UserID => Guid.Parse(FindClaim(ClaimTypes.NameIdentifier));
    private string FindClaim(string claimName)
    {

        var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;

        var claim = claimsIdentity.FindFirst(claimName);

        if (claim == null)
        {
            return null;
        }

        return claim.Value;

    }
}