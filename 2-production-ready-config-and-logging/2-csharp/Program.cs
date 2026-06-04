using ConfigAndLogging.Config;
using Serilog;
using Serilog.Formatting.Compact;

// Default environment = Local (loads appsettings.Local.json) when ASPNETCORE_ENVIRONMENT is unset.
var options = new WebApplicationOptions
{
    Args = args,
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Local",
};
var builder = WebApplication.CreateBuilder(options);

// PORT env (E2E random port) overrides App:Port so the typed config reflects the actual listen port.
var portOverride = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(portOverride))
{
    builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["App:Port"] = portOverride,
    });
}

// Log file path read from IConfiguration (App:LogFilePath) — not hard-coded in C# code.
var logFile = builder.Configuration["App:LogFilePath"] ?? "logs/app.log";

// UseSerilog replaces the default ILoggerFactory — EVERY ILogger<T> (incl. Kestrel/routing) routes
//  through Serilog. Equivalent to NestJS app.useLogger: a unified logger for framework and application.)
builder.Host.UseSerilog((ctx, cfg) => cfg
    // FromLogContext: enables per-request enrichment (e.g. RequestId).
    .Enrich.FromLogContext()
    // Console sink: human-friendly text template on the terminal.
    .WriteTo.Console()
    // File sink: CompactJsonFormatter — one JSON line per record for machine/aggregator queries.
    .WriteTo.File(new CompactJsonFormatter(), logFile));

// Configure<AppConfig> binds the App section — the ONLY place touching raw config.
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("App"));

builder.Services.AddControllers();

// Bind HTTP port from config (App:Port), env PORT overrides for E2E random ports.
var port = Environment.GetEnvironmentVariable("PORT")
    ?? builder.Configuration["App:Port"]
    ?? "3000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// request access log flows through Serilog — framework + app share the pipeline.
app.UseSerilogRequestLogging();

app.MapControllers();

app.Run();
