using ConfigAndLogging.Config;
using Serilog;
using Serilog.Formatting.Compact;

// Default environment = Local (loads appsettings.Local.json) when ASPNETCORE_ENVIRONMENT is unset.
// This is the config-layer entry point: all wiring below reads from IConfiguration, never raw env.
var options = new WebApplicationOptions
{
    Args = args,
    // Fall back to "Local" so the app boots in dev without needing an env var set.
    EnvironmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Local",
};
var builder = WebApplication.CreateBuilder(options);

// PORT env (used by E2E random-port assignment) overrides App:Port so the typed config
// reflects the actual listen port the test expects — avoids port-collision during parallel tests.
var portOverride = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(portOverride))
{
    // AddInMemoryCollection wins over JSON files in IConfiguration precedence chain.
    builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
    {
        ["App:Port"] = portOverride,
    });
}

// Log file path resolved from IConfiguration (App:LogFilePath before typed binding is available).
// Must happen before UseSerilog because the File sink is configured here.
var logFile = builder.Configuration["App:LogFilePath"] ?? "logs/app.log";

// UseSerilog replaces the default ILoggerFactory so EVERY ILogger<T> (including Kestrel/routing)
// routes through the same Serilog pipeline. Equivalent to NestJS app.useLogger — unified logger.
builder.Host.UseSerilog((ctx, cfg) => cfg
    // FromLogContext: enables structured per-request enrichment (e.g. RequestId from middleware).
    .Enrich.FromLogContext()
    // Console sink: human-friendly text output for developer terminals.
    .WriteTo.Console()
    // File sink: one compact JSON line per log record for machine/aggregator ingestion.
    .WriteTo.File(new CompactJsonFormatter(), logFile));

// Configure<AppConfig> binds the "App" IConfiguration section to the typed class.
// This is the ONLY place touching raw IConfiguration — all other components inject IOptions<AppConfig>.
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("App"));

builder.Services.AddControllers();

// Resolve listen port: PORT env wins (E2E override) → App:Port from config → fallback 3000.
var port = Environment.GetEnvironmentVariable("PORT")
    ?? builder.Configuration["App:Port"]
    ?? "3000";
// Bind to 0.0.0.0 so the server is reachable from the host during Docker/E2E runs.
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();

// SerilogRequestLogging adds access-log lines for every HTTP request through the unified pipeline.
app.UseSerilogRequestLogging();

app.MapControllers();

app.Run();
