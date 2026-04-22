namespace TripIt.Api.Features.Auth.DTOs;

public class CompleteProfileRequestDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
}