using ConfigAndLogging.Config;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace ConfigAndLogging.Controllers;

/// <summary>
/// AppController — reads application configuration via the typed IOptions pattern and logs
/// through the unified Serilog pipeline configured in Program.cs.
/// The controller never reads environment variables directly; all values come from the
/// injected AppConfig to enforce the single-config-source rule taught in this lesson.
/// </summary>
[ApiController]
public class AppController : ControllerBase
{
    // Typed config injected once — the handler never reads env directly.
    private readonly AppConfig _cfg;

    // ILogger<T> routes through Serilog (UseSerilog wired in Program.cs).
    private readonly ILogger<AppController> _logger;

    /// <summary>
    /// Inject the typed config options and the unified Serilog-backed logger.
    /// </summary>
    /// <param name="opts">Typed options wrapping the "App" config section.</param>
    /// <param name="logger">Framework logger backed by Serilog (wired in Program.cs).</param>
    public AppController(IOptions<AppConfig> opts, ILogger<AppController> logger)
    {
        // opts.Value materialises the bound AppConfig instance — safe to cache for the controller lifetime.
        _cfg = opts.Value;
        _logger = logger;
    }

    /// <summary>
    /// GET / — returns runtime identity (message, env, name, version, port) sourced entirely
    /// from config rather than hard-coded literals. Demonstrates that switching the active
    /// settings file changes the response without modifying any handler code.
    /// </summary>
    /// <returns>200 OK with the runtime status payload.</returns>
    [HttpGet("/")]
    public IActionResult GetStatus()
    {
        // Per-request log: Serilog attaches SourceContext = AppController and fans out to console + JSON file.
        _logger.LogInformation("GET / called - returning runtime config status");
        return Ok(new
        {
            // Message prefix is the env name — verifies the correct profile is active.
            message = $"{_cfg.NodeEnv} - config-and-logging-ready",
            env = _cfg.NodeEnv,
            appName = _cfg.Name,
            appVersion = _cfg.Version,
            appPort = _cfg.Port,
        });
    }

    /// <summary>
    /// GET /config — returns the full typed config snapshot (all 5 fields) to demonstrate
    /// that IOptions&lt;AppConfig&gt; provides the complete namespace in one injection,
    /// without reading individual keys ad-hoc from IConfiguration.
    /// </summary>
    /// <returns>200 OK with the 5-field AppConfig snapshot (camelCase JSON).</returns>
    [HttpGet("/config")]
    public IActionResult GetConfig()
    {
        // Log so the endpoint hit is visible in both console and the JSON log file.
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
