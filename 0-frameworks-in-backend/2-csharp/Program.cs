using FrameworksDemo.Cat;
using FrameworksDemo.Dog;

// composition root: register providers into ASP.NET's IoC container. The
// framework creates + wires (injects) them — just like NestJS does with @Injectable.)
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<CatService>();   // 1 singleton instance shared across the entire app
builder.Services.AddSingleton<DogService>();   // container detects DogService requires CatService -> injects it automatically

var app = builder.Build();

// handlers receive services as parameters -> the container resolves them.
app.MapGet("/cats", (CatService cat) => cat.All());
app.MapGet("/dogs/spy", (DogService dog) => dog.SpyReport());
app.MapGet("/dogs/cats-via-di", (DogService dog) => dog.CatsViaDI());

var port = Environment.GetEnvironmentVariable("PORT") ?? "3000";
app.Run($"http://localhost:{port}");
