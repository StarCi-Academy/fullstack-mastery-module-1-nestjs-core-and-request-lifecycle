namespace ConfigAndLogging.Config;

/// <summary>
/// AppConfig — typed options-pattern class wrapping the entire "App" config section.
/// Every property carries a safe default so the application boots even when a settings
/// file is absent (useful in test/CI environments).
/// The only place in the codebase that touches raw IConfiguration — all other components
/// inject IOptions&lt;AppConfig&gt; and read from this typed object.
/// </summary>
public sealed class AppConfig
{
    /// <summary>Application name used in HTTP responses and observability labels.</summary>
    public string Name { get; init; } = "local";

    /// <summary>Application semantic version, useful when tracing concurrent deployments.</summary>
    public string Version { get; init; } = "0.0.1";

    /// <summary>HTTP listen port. Defaults to 3000; overridden by App:Port or PORT env for E2E.</summary>
    public int Port { get; init; } = 3000;

    /// <summary>Runtime environment name (e.g. "local" or "production"). Mirrors APP_ENV / NODE_ENV.</summary>
    public string NodeEnv { get; init; } = "local";

    /// <summary>
    /// Relative path for the Serilog File sink JSON output.
    /// Centralised here so both Program.cs and any future log service read from the same config source.
    /// </summary>
    public string LogFilePath { get; init; } = "logs/app.log";
}
