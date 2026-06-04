using ErrorHandlingDemo.Items;
using Microsoft.AspNetCore.WebUtilities;

namespace ErrorHandlingDemo.Common;

/// Global error convergence point — middleware at the head of the pipeline, normalizing every exception into one envelope.
/// </summary>
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    /// Inject the next delegate + logger to wrap the rest of the pipeline.
    /// </summary>
    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// Run the pipeline inside try/catch; classify expected vs unexpected then return the standard envelope.
    /// </summary>
    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (Exception ex)
        {
            // Expected error → status + the domain's safe message. Unexpected error → 500 + generic message.
            var (status, message) = ex switch
            {
                ItemNotFoundException => (StatusCodes.Status404NotFound, ex.Message),
                ValidationException => (StatusCodes.Status400BadRequest, ex.Message),
                _ => (StatusCodes.Status500InternalServerError, "Internal server error"),
            };

            if (status == StatusCodes.Status500InternalServerError)
            {
                // The stack trace is logged internally ONLY, never returned to the client.
                _logger.LogError(ex, "Unhandled {Method} {Path}", ctx.Request.Method, ctx.Request.Path);
            }

            await WriteEnvelope(ctx, status, message);
        }
    }

    /// Write the normalized error envelope — the single place that decides what the client sees.
    /// </summary>
    private static Task WriteEnvelope(HttpContext ctx, int status, string message)
    {
        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/json";
        var body = new
        {
            statusCode = status,
            error = ReasonPhrases.GetReasonPhrase(status),
            message,
            timestamp = DateTime.UtcNow.ToString("o"),
            path = ctx.Request.Path.Value,
        };
        return ctx.Response.WriteAsJsonAsync(body);
    }
}
