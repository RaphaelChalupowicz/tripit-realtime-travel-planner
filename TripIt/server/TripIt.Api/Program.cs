using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using TripIt.Api.Data;
using TripIt.Api.Features.Auth;

var builder = WebApplication.CreateBuilder(args);
const string FrontendCorsPolicy = "AllowFrontend";

// Allow overriding the default connection string with a SUPABASE_PG_CONN
var supabaseConn = Environment.GetEnvironmentVariable("SUPABASE_PG_CONN");
if (!string.IsNullOrWhiteSpace(supabaseConn))
{
    // inject into configuration so later code can still read GetConnectionString("DefaultConnection")
    builder.Configuration["ConnectionStrings:DefaultConnection"] = supabaseConn;
}

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'DefaultConnection' is not configured. " +
        "Provide it via configuration, such as appsettings, user-secrets, or the " +
        "'ConnectionStrings__DefaultConnection' environment variable.");
}

// Log which DB host we're connecting to (redact password)
try
{
    var csBuilder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
    var host = csBuilder.Host;
    var db = csBuilder.Database;
    Console.WriteLine($"Connecting to Postgres host={host} database={db}");
}
catch
{
    Console.WriteLine("Connecting to Postgres (connection string could not be parsed)");
}

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:8080")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var supabaseIssuer = builder.Configuration["Supabase:JwtIssuer"];
var supabaseAudience = builder.Configuration["Supabase:JwtAudience"];

if (string.IsNullOrWhiteSpace(supabaseIssuer) || string.IsNullOrWhiteSpace(supabaseAudience))
{
    throw new InvalidOperationException(
        "Supabase JWT settings are not configured. Set Supabase:JwtIssuer and Supabase:JwtAudience.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = supabaseIssuer;
        options.Audience = supabaseAudience;
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();
    await DatabaseRepair.EnsureUsersTableAsync(dbContext);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(FrontendCorsPolicy);
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();