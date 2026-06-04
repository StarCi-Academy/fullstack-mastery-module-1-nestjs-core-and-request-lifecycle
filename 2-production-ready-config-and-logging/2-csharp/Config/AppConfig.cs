namespace ConfigAndLogging.Config;

/// AppConfig — typed namespace (options pattern) wrapping the whole config shape.
/// Every property has a default so the app still boots when a file is missing.
/// </summary>
public sealed class AppConfig
{
    /// application name.)</summary>
    public string Name { get; init; } = "local";

    /// application version.)</summary>
    public string Version { get; init; } = "0.0.1";

    /// HTTP port.)</summary>
    public int Port { get; init; } = 3000;

    /// runtime environment.)</summary>
    public string NodeEnv { get; init; } = "local";

    /// log file path.)</summary>
    public string LogFilePath { get; init; } = "logs/app.log";
}
