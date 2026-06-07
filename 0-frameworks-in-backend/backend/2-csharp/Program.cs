// Composition root — this is the single place where services are created and wired.
// ASP.NET's IoC container handles creation + injection, just like NestJS @Module + @Injectable.
using FrameworksDemo.Cat;
using FrameworksDemo.Dog;

var builder = WebApplication.CreateBuilder(args);

// Register CatService as a singleton — one instance shared across the entire app lifetime.
builder.Services.AddSingleton<CatService>();
// Register DogService as a singleton — the container detects it requires CatService and injects it automatically.
builder.Services.AddSingleton<DogService>();

var app = builder.Build();

// Minimal API handlers: the container resolves service parameters by type — no manual new() calls.
app.MapGet("/cats", (CatService cat) => cat.All());
app.MapGet("/dogs/spy", (DogService dog) => dog.SpyReport());
app.MapGet("/dogs/cats-via-di", (DogService dog) => dog.CatsViaDI());

// Read port from env so the test harness can assign a conflict-free port (e.g. PORT=3003).
var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
app.Run($"http://127.0.0.1:{port}");
