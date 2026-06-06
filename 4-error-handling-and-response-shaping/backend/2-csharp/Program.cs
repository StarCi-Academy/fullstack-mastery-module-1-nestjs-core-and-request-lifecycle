// ASP.NET Core minimal-API entry point for the error-handling lesson.
// Registers ExceptionHandlingMiddleware FIRST so it wraps every request,
// then maps item endpoints and starts the server.
using ErrorHandlingDemo.Common;
using ErrorHandlingDemo.Items;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Place at the HEAD of the pipeline to wrap every middleware/endpoint behind it.
// Any exception thrown by a downstream handler or endpoint is caught here and
// converted into the standardized error envelope.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Register all /items/* routes defined in ItemsEndpoints.
app.MapItemsEndpoints();

// Default port 3000 — allow override via env PORT so audit/parallel tests avoid port collisions.
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
// Bind to loopback to avoid OS firewall prompts during local testing.
var host = Environment.GetEnvironmentVariable("HOST") ?? "127.0.0.1";
app.Run($"http://{host}:{port}");
