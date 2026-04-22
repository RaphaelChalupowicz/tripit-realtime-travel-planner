using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TripIt.Api.Features.Auth.DTOs;

namespace TripIt.Api.Features.Auth;

[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [Authorize]
    [HttpPost("auth/sync-user")]
    public async Task<ActionResult<CurrentUserDto>> SyncUser([FromBody] SyncUserRequestDto request)
    {
        try
        {
            var result = await _authService.SyncUserAsync(User, request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("auth/complete-profile")]
    public async Task<ActionResult<CurrentUserDto>> CompleteProfile([FromBody] CompleteProfileRequestDto request)
    {
        try
        {
            var result = await _authService.CompleteProfileAsync(User, request);
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpGet("auth/me")]
    public async Task<ActionResult<CurrentUserDto>> GetMe()
    {
        try
        {
            var user = await _authService.GetCurrentUserAsync(User);

            if (user is null)
                return NotFound(new { message = "Authenticated user was not found in local database." });

            return Ok(user);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("auth/me")]
    public async Task<IActionResult> DeleteMe()
    {
        try
        {
            await _authService.DeleteCurrentUserAsync(User);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("auth/account")]
    public async Task<IActionResult> DeleteAccount()
    {
        try
        {
            await _authService.DeleteAccountAsync(User);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }
    }
}