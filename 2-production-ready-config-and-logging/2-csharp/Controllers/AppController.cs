using ConfigAndLogging.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ConfigAndLogging.Controllers;

/// AppController — reads config via typed IOptions and logs through the unified Serilog logger.
/// </summary>
[ApiController]
public class AppController : ControllerBase
{
    // Typed config injected once — the handler never reads env directly.
    private readonly AppConfig _cfg;

    // ILogger<T> routes through Serilog (UseSerilog wired in Program.cs).
    private readonly ILogger<AppController> _logger;

    /// Inject the typed config options + the unified logger.
    /// </summary>
    public AppController(IOptions<AppConfig> opts, ILogger<AppController> logger)
    {
        _cfg = opts.Value;
        _logger = logger;
    }

    /// GET / — emits runtime identity sourced from config (not hard-coded).
    /// </summary>
    [HttpGet("/")]
    public IActionResult GetStatus()
    {
        // Per-request log: Serilog attaches SourceContext = AppController and fans out to console + JSON file.
        _logger.LogInformation("GET / called - returning runtime config status");
        return Ok(new
        {
            message = $"{_cfg.NodeEnv} - config-and-logging-ready",
            env = _cfg.NodeEnv,
            appName = _cfg.Name,
            appVersion = _cfg.Version,
            appPort = _cfg.Port,
        });
    }

    /// GET /config — returns the typed snapshot with all 5 fields (default camelCase).
    /// </summary>
    [HttpGet("/config")]
    public IActionResult GetConfig()
    {
        // Log so Flow 4 can observe the JSON line in logs/app.log.
        _logger.LogInformation("GET /config called - returning AppConfig snapshot");
        return Ok(new
        {
            name = _cfg.Name,
            version = _cfg.Version,
            port = _cfg.Port,
            nodeEnv = _cfg.NodeEnv,
            logFilePath = _cfg.LogFilePath,
        });
    }
}
