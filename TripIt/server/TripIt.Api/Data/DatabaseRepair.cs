using Microsoft.EntityFrameworkCore;

namespace TripIt.Api.Data;

public static class DatabaseRepair
{
    public static async Task EnsureUsersTableAsync(AppDbContext dbContext)
    {
        const string createUsersTableSql = """
            CREATE TABLE IF NOT EXISTS public."Users" (
                "Id" uuid NOT NULL,
                "ExternalAuthId" character varying(255) NOT NULL,
                "AuthProvider" character varying(50) NOT NULL,
                "Email" character varying(255) NOT NULL,
                "FirstName" character varying(100) NOT NULL,
                "LastName" character varying(100) NOT NULL,
                "ProfileImageUrl" character varying(500),
                "IsAdmin" boolean NOT NULL DEFAULT FALSE,
                "IsOnboardingCompleted" boolean NOT NULL DEFAULT FALSE,
                "CreatedAt" timestamp with time zone NOT NULL,
                "UpdatedAt" timestamp with time zone NOT NULL,
                CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
            );
            """;

        const string createEmailIndexSql = """
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Email"
            ON public."Users" ("Email");
            """;

        const string createExternalAuthIdIndexSql = """
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_ExternalAuthId"
            ON public."Users" ("ExternalAuthId");
            """;

        await dbContext.Database.ExecuteSqlRawAsync(createUsersTableSql);
        await dbContext.Database.ExecuteSqlRawAsync(createEmailIndexSql);
        await dbContext.Database.ExecuteSqlRawAsync(createExternalAuthIdIndexSql);
    }
}