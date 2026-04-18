using Microsoft.AspNetCore.Mvc;

namespace TripIt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            message = "TripIt API is running"
        });
    }
}