namespace TripIt.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ExternalAuthId { get; set; } = string.Empty;
    public string AuthProvider { get; set; } = "Supabase";

    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    public string? ProfileImageUrl { get; set; }

    public bool IsAdmin { get; set; } = false;
    public bool IsOnboardingCompleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}