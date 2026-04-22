namespace TripIt.Api.Features.Auth.DTOs;

public class CurrentUserDto
{
    public Guid Id { get; set; }
    public string ExternalAuthId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public bool IsAdmin { get; set; }
    public bool IsOnboardingCompleted { get; set; }
}