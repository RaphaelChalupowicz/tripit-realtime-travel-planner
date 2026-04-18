using Microsoft.AspNetCore.Mvc;
using TripIt.Api.Routing;
using HttpMethods = TripIt.Api.Routing.HttpMethods;

namespace TripIt.Api.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    [HttpRequest("/Health", HttpMethods.Get)]
    public IActionResult Get()
    {
        return Ok(new
        {
            message = "TripIt API is running"
        });
    }
}