using ErrorHandlingDemo.Items;
using Microsoft.AspNetCore.WebUtilities;

namespace ErrorHandlingDemo.Common;

/// <summary>
/// Global error convergence point — middleware at the head of the pipeline,
/// normalizing every exception into one consistent envelope.
/// </summary>
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    /// <summary>
    /// Inject the next delegate and logger to wrap the rest of the pipeline.
    /// </summary>
    /// <param name="next">The next middleware in the pipeline.</param>
    /// <param name="logger">Logger for recording unexpected error stacks internally.</param>
    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Run the inner pipeline inside try/catch; classify expected vs unexpected,
    /// then return the standard error envelope.
    /// </summary>
    /// <param name="ctx">The current HTTP context.</param>
    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            // Pass control to the next middleware / endpoint handler.
            await _next(ctx);
        }
        catch (Exception ex)
        {
            // Expected error → use the domain's safe message with correct status code.
            // Unexpected error → always 500 with a generic message (real detail stays in logs).
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

            // Write the normalized envelope — single place that decides what the client sees.
            await WriteEnvelope(ctx, status, message);
        }
    }

    /// <summary>
    /// Write the normalized error envelope as JSON.
    /// Single place that decides what the client receives.
    /// </summary>
    /// <param name="ctx">The current HTTP context (used to set status code + write body).</param>
    /// <param name="status">HTTP status code to return.</param>
    /// <param name="message">Safe error message for the client.</param>
    private static Task WriteEnvelope(HttpContext ctx, int status, string message)
    {
        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/json";
        var body = new
        {
            statusCode = status,
            // ReasonPhrases maps 404 → "Not Found", 400 → "Bad Request", 500 → "Internal Server Error".
            error = ReasonPhrases.GetReasonPhrase(status),
            message,
            timestamp = DateTime.UtcNow.ToString("o"),
            path = ctx.Request.Path.Value,
        };
        return ctx.Response.WriteAsJsonAsync(body);
    }
}
