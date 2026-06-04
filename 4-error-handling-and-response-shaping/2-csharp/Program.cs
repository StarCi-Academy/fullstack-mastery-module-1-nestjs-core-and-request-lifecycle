using ErrorHandlingDemo.Common;
using ErrorHandlingDemo.Items;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Place it at the HEAD of the pipeline to wrap every middleware/endpoint behind it.
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapItemsEndpoints();

// Default port 3000 — allow override via env PORT so audit/parallel tests avoid port collisions.
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
app.Run($"http://0.0.0.0:{port}");
