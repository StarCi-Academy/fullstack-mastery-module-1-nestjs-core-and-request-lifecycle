namespace RequestLifecycle;

/// <summary>
/// RequestIdMiddleware attaches the x-request-id header earliest so later layers can trace it.
/// </summary>
public class RequestIdMiddleware
{
    /// <summary>_next is the next middleware in the pipeline.</summary>
    private readonly RequestDelegate _next;

    /// <summary>Construct the middleware with the next delegate.</summary>
    public RequestIdMiddleware(RequestDelegate next) => _next = next;

    /// <summary>
    /// InvokeAsync generates/reuses x-request-id then passes control to the next layer.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Reuse the client-provided id if present, otherwise generate a new guid.
        var id = context.Request.Headers["x-request-id"].FirstOrDefault();
        if (string.IsNullOrEmpty(id))
        {
            id = Guid.NewGuid().ToString();
            context.Request.Headers["x-request-id"] = id;
        }
        // Echo back so client or API gateway can correlate during debugging.
        context.Response.Headers["x-request-id"] = id;
        await _next(context);
    }
}

/// <summary>
/// TimingMiddleware records the start mark into HttpContext.Items before the handler to compute executionMs.
/// </summary>
public class TimingMiddleware
{
    /// <summary>_next is the next middleware in the pipeline.</summary>
    private readonly RequestDelegate _next;

    /// <summary>Construct the middleware with the next delegate.</summary>
    public TimingMiddleware(RequestDelegate next) => _next = next;

    /// <summary>
    /// InvokeAsync records the start mark then passes control to the next layer.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Record the start mark into Items — only the later layer (result filter) reads it back to compute executionMs.
        context.Items["startTs"] = System.Diagnostics.Stopwatch.GetTimestamp();
        await _next(context);
    }
}

/// <summary>
/// LoggerMiddleware writes a one-line access log per request.
/// </summary>
public class LoggerMiddleware
{
    /// <summary>_next is the next middleware in the pipeline.</summary>
    private readonly RequestDelegate _next;

    /// <summary>Construct the middleware with the next delegate.</summary>
    public LoggerMiddleware(RequestDelegate next) => _next = next;

    /// <summary>
    /// InvokeAsync passes control to the next layer (access log hook point).
    /// Logs method + path so traffic is observable before any handler runs.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Log early so the entry is written even if the handler throws.
        var id = context.Request.Headers["x-request-id"].FirstOrDefault() ?? "n/a";
        Console.WriteLine($"[LoggerMiddleware] {context.Request.Method} {context.Request.Path} requestId={id}");
        await _next(context);
    }
}
