using Microsoft.AspNetCore.Mvc.Routing;

namespace TripIt.Api.Routing;

public sealed class HttpRequestAttribute : HttpMethodAttribute
{
    public HttpRequestAttribute(string template, string method)
        : base(new[] { method }, template)
    {
    }
}
