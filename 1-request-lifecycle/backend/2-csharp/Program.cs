using Microsoft.AspNetCore.Mvc;
using RequestLifecycle;

var builder = WebApplication.CreateBuilder(args);

// Allow ASPNETCORE_URLS to take full control (e.g. set by test infra); only apply PORT fallback when absent.
if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ASPNETCORE_URLS")))
{
    // Read PORT env so parallel audit tests can assign unique ports without editing source.
    var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
    builder.WebHost.UseUrls($"http://127.0.0.1:{port}");
}

// Register the business service + filters for DI.
builder.Services.AddScoped<ItemsService>();
// RoleActionFilter must be scoped so it can be used via [ServiceFilter] in the controller.
builder.Services.AddScoped<RoleActionFilter>();

builder.Services.AddControllers(options =>
{
    // ResponseEnvelopeFilter is a global result filter: wraps successful payloads outbound.
    options.Filters.Add<ResponseEnvelopeFilter>();
});

// Reshape the 400 body to {message,error,statusCode} instead of the default ValidationProblemDetails,
// so the response contract matches the TypeScript / Java implementations.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        // Take the first validation error message; fall back to "Bad Request" if none.
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

// The app.UseMiddleware<> order is the inbound order; response processing is reversed (outbound).
app.UseMiddleware<RequestIdMiddleware>();   // attach x-request-id first so all downstream layers can read it
app.UseMiddleware<TimingMiddleware>();      // record start mark before handler to compute executionMs
app.UseMiddleware<LoggerMiddleware>();      // log access early so traffic is observable before the handler
app.MapControllers();
app.Run();
