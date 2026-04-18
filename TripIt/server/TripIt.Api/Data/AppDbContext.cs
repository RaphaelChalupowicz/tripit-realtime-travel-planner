using Microsoft.EntityFrameworkCore;
using TripIt.Api.Models;

namespace TripIt.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.ExternalAuthId)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(u => u.AuthProvider)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(u => u.Email)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(u => u.FirstName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(u => u.LastName)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(u => u.ProfileImageUrl)
                .HasMaxLength(500);

            entity.Property(u => u.IsAdmin)
                .HasDefaultValue(false)
                .IsRequired();

            entity.Property(u => u.IsOnboardingCompleted)
                .HasDefaultValue(false)
                .IsRequired();

            entity.Property(u => u.CreatedAt)
                .IsRequired();

            entity.Property(u => u.UpdatedAt)
                .IsRequired();

            entity.HasIndex(u => u.Email)
                .IsUnique();

            entity.HasIndex(u => u.ExternalAuthId)
                .IsUnique();
        });
    }
}