using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TripIt.Api.Data;
using TripIt.Api.Features.Auth.DTOs;
using TripIt.Api.Models;

namespace TripIt.Api.Features.Auth;

public class AuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task DeleteAccountAsync(ClaimsPrincipal principal)
    {
        var externalAuthId = GetRequiredClaim(principal, "sub", ClaimTypes.NameIdentifier);

        await DeleteSupabaseUserAsync(externalAuthId);
        await DeleteLocalUserByExternalAuthIdAsync(externalAuthId);
    }

    public async Task<CurrentUserDto> SyncUserAsync(ClaimsPrincipal principal, SyncUserRequestDto request)
    {
        var externalAuthId = GetRequiredClaim(principal, "sub", ClaimTypes.NameIdentifier);
        var email = GetRequiredClaim(principal, "email", ClaimTypes.Email);

        var firstNameFromToken =
            GetOptionalClaim(principal, "given_name") ??
            GetOptionalClaim(principal, "first_name");

        var lastNameFromToken =
            GetOptionalClaim(principal, "family_name") ??
            GetOptionalClaim(principal, "last_name");

        var pictureFromToken =
            GetOptionalClaim(principal, "picture") ??
            GetOptionalClaim(principal, "avatar_url");

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.ExternalAuthId == externalAuthId);

        if (user is null)
        {
            user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        if (user is null)
        {
            user = new User
            {
                ExternalAuthId = externalAuthId,
                AuthProvider = "Supabase",
                Email = email,
                FirstName = request.FirstName?.Trim() ?? firstNameFromToken ?? string.Empty,
                LastName = request.LastName?.Trim() ?? lastNameFromToken ?? string.Empty,
                ProfileImageUrl = request.ProfileImageUrl?.Trim() ?? pictureFromToken,
                IsAdmin = false,
                IsOnboardingCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
        }
        else
        {
            user.ExternalAuthId = externalAuthId;
            user.AuthProvider = "Supabase";
            user.Email = email;

            if (!string.IsNullOrWhiteSpace(request.FirstName))
                user.FirstName = request.FirstName.Trim();
            else if (string.IsNullOrWhiteSpace(user.FirstName) && !string.IsNullOrWhiteSpace(firstNameFromToken))
                user.FirstName = firstNameFromToken;

            if (!string.IsNullOrWhiteSpace(request.LastName))
                user.LastName = request.LastName.Trim();
            else if (string.IsNullOrWhiteSpace(user.LastName) && !string.IsNullOrWhiteSpace(lastNameFromToken))
                user.LastName = lastNameFromToken;

            if (!string.IsNullOrWhiteSpace(request.ProfileImageUrl))
                user.ProfileImageUrl = request.ProfileImageUrl.Trim();
            else if (string.IsNullOrWhiteSpace(user.ProfileImageUrl) && !string.IsNullOrWhiteSpace(pictureFromToken))
                user.ProfileImageUrl = pictureFromToken;

            user.UpdatedAt = DateTime.UtcNow;
        }

        await _dbContext.SaveChangesAsync();
        return MapToDto(user);
    }

    public async Task<CurrentUserDto?> GetCurrentUserAsync(ClaimsPrincipal principal)
    {
        var externalAuthId = GetRequiredClaim(principal, "sub", ClaimTypes.NameIdentifier);

        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.ExternalAuthId == externalAuthId);

        return user is null ? null : MapToDto(user);
    }

    public async Task DeleteCurrentUserAsync(ClaimsPrincipal principal)
    {
        var externalAuthId = GetRequiredClaim(principal, "sub", ClaimTypes.NameIdentifier);

        await DeleteLocalUserByExternalAuthIdAsync(externalAuthId);
    }

    public async Task<CurrentUserDto> CompleteProfileAsync(
        ClaimsPrincipal principal,
        CompleteProfileRequestDto request)
    {
        var externalAuthId = GetRequiredClaim(principal, "sub", ClaimTypes.NameIdentifier);

        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.ExternalAuthId == externalAuthId);

        if (user is null)
            throw new UnauthorizedAccessException("Authenticated user was not found in local database.");

        if (string.IsNullOrWhiteSpace(request.FirstName))
            throw new ArgumentException("First name is required.");

        if (string.IsNullOrWhiteSpace(request.LastName))
            throw new ArgumentException("Last name is required.");

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();

        if (!string.IsNullOrWhiteSpace(request.ProfileImageUrl))
            user.ProfileImageUrl = request.ProfileImageUrl.Trim();

        user.IsOnboardingCompleted = true;
        user.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapToDto(user);
    }

    private static CurrentUserDto MapToDto(User user)
    {
        return new CurrentUserDto
        {
            Id = user.Id,
            ExternalAuthId = user.ExternalAuthId,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            ProfileImageUrl = user.ProfileImageUrl,
            IsAdmin = user.IsAdmin,
            IsOnboardingCompleted = user.IsOnboardingCompleted
        };
    }

    private static string GetRequiredClaim(ClaimsPrincipal principal, params string[] claimTypes)
    {
        foreach (var claimType in claimTypes)
        {
            var value = principal.FindFirstValue(claimType);
            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        throw new UnauthorizedAccessException($"Missing required claim. Expected one of: {string.Join(", ", claimTypes)}");
    }

    private static string? GetOptionalClaim(ClaimsPrincipal principal, params string[] claimTypes)
    {
        foreach (var claimType in claimTypes)
        {
            var value = principal.FindFirstValue(claimType);
            if (!string.IsNullOrWhiteSpace(value))
                return value;
        }

        return null;
    }

    private async Task DeleteLocalUserByExternalAuthIdAsync(string externalAuthId)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.ExternalAuthId == externalAuthId);

        if (user is null)
            return;

        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }

    private async Task DeleteSupabaseUserAsync(string externalAuthId)
    {
        var supabaseUrl = _configuration["Supabase:Url"];
        var serviceRoleKey = ResolveServiceRoleKey();

        if (string.IsNullOrWhiteSpace(supabaseUrl) || string.IsNullOrWhiteSpace(serviceRoleKey))
        {
            throw new InvalidOperationException(
                "Supabase account deletion is not configured. Set Supabase:Url and Supabase:ServiceRoleKey in configuration.");
        }

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("apikey", serviceRoleKey);
        httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", serviceRoleKey);

        var requestUri = $"{supabaseUrl.TrimEnd('/')}/auth/v1/admin/users/{externalAuthId}";
        var response = await httpClient.DeleteAsync(requestUri);

        if (response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return;
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        throw new InvalidOperationException(
            $"Failed to delete Supabase auth user. Status {(int)response.StatusCode}: {responseBody}");
    }

    private string? ResolveServiceRoleKey()
    {
        var candidates = new[]
        {
            _configuration["Supabase:ServiceRoleKey"],
            _configuration["Supabase__ServiceRoleKey"],
            _configuration["SUPABASE_SERVICE_ROLE_KEY"]
        };

        foreach (var candidate in candidates)
        {
            var normalized = NormalizeSecret(candidate);
            if (string.IsNullOrWhiteSpace(normalized))
                continue;

            if (normalized.Contains("YOUR_SERVICE_ROLE_KEY", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "Supabase service role key is still set to a placeholder value. Configure a real service_role key.");
            }

            return normalized;
        }

        return null;
    }

    private static string? NormalizeSecret(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var trimmed = value.Trim();
        if ((trimmed.StartsWith('"') && trimmed.EndsWith('"')) ||
            (trimmed.StartsWith('\'') && trimmed.EndsWith('\'')))
        {
            trimmed = trimmed[1..^1].Trim();
        }

        return string.IsNullOrWhiteSpace(trimmed) ? null : trimmed;
    }
}