namespace TripIt.Api.Features.Auth.DTOs;

public class SyncUserRequestDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfileImageUrl { get; set; }
}