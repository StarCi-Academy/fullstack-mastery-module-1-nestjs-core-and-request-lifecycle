using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace RequestLifecycle;

/// <summary>
/// ResponseEnvelopeFilter wraps the action payload into the standard envelope outbound (result filter).
/// Runs after the action handler, before the result bytes are written to the socket.
/// </summary>
public class ResponseEnvelopeFilter : IResultFilter
{
    /// <summary>
    /// OnResultExecuting runs after the action, before the result is written —
    /// the single point to wrap the payload into the standard envelope.
    /// </summary>
    public void OnResultExecuting(ResultExecutingContext context)
    {
        // Only wrap successful (2xx) responses; errors (400/403) keep the raw {message,error,statusCode} shape.
        if (context.Result is ObjectResult result
            && (result.StatusCode is null or >= 200 and < 300))
        {
            var http = context.HttpContext;
            // Read startTs recorded by TimingMiddleware to compute executionMs — proving inbound/outbound axes work.
            var startTs = http.Items["startTs"] as long?;
            long? executionMs = startTs is null
                ? null
                : (Stopwatch.GetTimestamp() - startTs) * 1000 / Stopwatch.Frequency;
            // Wrap into one envelope so all endpoints return the same contract.
            result.Value = new
            {
                data = result.Value,
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = http.Request.Headers["x-request-id"].FirstOrDefault(),
                executionMs,
            };
        }
    }

    /// <summary>
    /// OnResultExecuted needs no handling — the envelope is finished in OnResultExecuting.
    /// </summary>
    public void OnResultExecuted(ResultExecutedContext context) { }
}

/// <summary>
/// RoleActionFilter blocks requests whose role is not admin with HTTP 403 before the action runs.
/// Analogous to NestJS Guard: the action never executes with a forbidden role.
/// </summary>
public class RoleActionFilter : IActionFilter
{
    /// <summary>AllowedRole is the only role permitted to access the restricted route.</summary>
    private const string AllowedRole = "admin";

    /// <summary>
    /// OnActionExecuting reads the role query and sets context.Result = 403 if invalid,
    /// short-circuiting execution before the action runs.
    /// </summary>
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var role = context.HttpContext.Request.Query["role"].FirstOrDefault();
        if (role == AllowedRole)
        {
            // Role is valid — let the pipeline continue to the action.
            return;
        }
        // Set context.Result to short-circuit — the action never runs with a forbidden role.
        context.Result = new ObjectResult(new
        {
            message = $"Role \"{role}\" is not allowed; expected \"{AllowedRole}\"",
            error = "Forbidden",
            statusCode = StatusCodes.Status403Forbidden,
        })
        {
            StatusCode = StatusCodes.Status403Forbidden,
        };
    }

    /// <summary>
    /// OnActionExecuted needs no handling — the allow/deny decision is finished before the action.
    /// </summary>
    public void OnActionExecuted(ActionExecutedContext context) { }
}
