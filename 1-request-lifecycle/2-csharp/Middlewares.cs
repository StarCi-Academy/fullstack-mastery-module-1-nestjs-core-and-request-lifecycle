namespace RequestLifecycle;

/// RequestIdMiddleware attaches the x-request-id header earliest so later layers can trace it.
/// </summary>
public class RequestIdMiddleware
{
    /// _next is the next middleware in the pipeline.
    /// </summary>
    private readonly RequestDelegate _next;

    /// Construct the middleware with the next delegate.
    /// </summary>
    public RequestIdMiddleware(RequestDelegate next) => _next = next;

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
        context.Response.Headers["x-request-id"] = id;
        await _next(context);
    }
}

/// TimingMiddleware records the start mark into HttpContext.Items before the handler to compute executionMs.
/// </summary>
public class TimingMiddleware
{
    /// _next is the next middleware in the pipeline.
    /// </summary>
    private readonly RequestDelegate _next;

    /// Construct the middleware with the next delegate.
    /// </summary>
    public TimingMiddleware(RequestDelegate next) => _next = next;

    /// InvokeAsync records the start mark then passes control to the next layer.
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        // Record the start mark into Items — only the later layer (result filter) reads it back.
        context.Items["startTs"] = System.Diagnostics.Stopwatch.GetTimestamp();
        await _next(context);
    }
}

/// LoggerMiddleware writes a one-line access log per request.
/// </summary>
public class LoggerMiddleware
{
    /// _next is the next middleware in the pipeline.
    /// </summary>
    private readonly RequestDelegate _next;

    /// Construct the middleware with the next delegate.
    /// </summary>
    public LoggerMiddleware(RequestDelegate next) => _next = next;

    /// InvokeAsync passes control to the next layer (access log hook point).
    /// </summary>
    public async Task InvokeAsync(HttpContext context)
    {
        await _next(context);
    }
}
