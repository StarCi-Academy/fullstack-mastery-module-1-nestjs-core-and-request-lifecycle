using Microsoft.AspNetCore.Mvc;
using RequestLifecycle;

var builder = WebApplication.CreateBuilder(args);

// Listen on port 3000 by default; allow the ASPNETCORE_URLS env var to override.
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    builder.WebHost.UseUrls("http://localhost:3000");
}

// Register the business service + filters for DI.
builder.Services.AddScoped<ItemsService>();
builder.Services.AddScoped<RoleActionFilter>();

builder.Services.AddControllers(options =>
{
    // ResponseEnvelopeFilter is a global result filter: wraps successful payloads outbound.
    options.Filters.Add<ResponseEnvelopeFilter>();
});

// Reshape the 400 body to {message,error,statusCode} instead of the default ValidationProblemDetails.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var message = context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .FirstOrDefault() ?? "Bad Request";
        return new BadRequestObjectResult(new
        {
            message,
            error = "Bad Request",
            statusCode = StatusCodes.Status400BadRequest,
        });
    };
});

var app = builder.Build();

// The app.UseMiddleware<> order is the inbound order and reversed outbound.
app.UseMiddleware<RequestIdMiddleware>();   // attach x-request-id first
app.UseMiddleware<TimingMiddleware>();      // record start mark before handler
app.UseMiddleware<LoggerMiddleware>();
app.MapControllers();
app.Run();
