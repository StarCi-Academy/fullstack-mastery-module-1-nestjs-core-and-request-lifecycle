using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace RequestLifecycle;

/// ResponseEnvelopeFilter wraps the action payload into the standard envelope outbound (result filter).
/// </summary>
public class ResponseEnvelopeFilter : IResultFilter
{
    /// OnResultExecuting runs after the action, before the result is written — the single point to wrap the payload.
    /// </summary>
    public void OnResultExecuting(ResultExecutingContext context)
    {
        // Only wrap successful (2xx) responses; errors (400/403) keep the raw {message,error,statusCode} shape.
        if (context.Result is ObjectResult result
            && (result.StatusCode is null or >= 200 and < 300))
        {
            var http = context.HttpContext;
            // Read startTs recorded by TimingMiddleware to compute executionMs — proving the inbound/outbound axes.
            var startTs = http.Items["startTs"] as long?;
            long? executionMs = startTs is null
                ? null
                : (Stopwatch.GetTimestamp() - startTs) * 1000 / Stopwatch.Frequency;
            result.Value = new
            {
                data = result.Value,
                timestamp = DateTime.UtcNow.ToString("o"),
                requestId = http.Request.Headers["x-request-id"].FirstOrDefault(),
                executionMs,
            };
        }
    }

    /// OnResultExecuted needs no handling — the envelope is finished in OnResultExecuting.
    /// </summary>
    public void OnResultExecuted(ResultExecutedContext context) { }
}

/// RoleActionFilter blocks requests whose role is not admin with HTTP 403 before the action.
/// </summary>
public class RoleActionFilter : IActionFilter
{
    /// AllowedRole is the only role allowed to access the restricted route.
    /// </summary>
    private const string AllowedRole = "admin";

    /// OnActionExecuting reads the role query and sets context.Result = 403 if invalid (blocking the action).
    /// </summary>
    public void OnActionExecuting(ActionExecutingContext context)
    {
        var role = context.HttpContext.Request.Query["role"].FirstOrDefault();
        if (role == AllowedRole)
        {
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

    /// OnActionExecuted needs no handling — the allow/deny decision is finished before the action.
    /// </summary>
    public void OnActionExecuted(ActionExecutedContext context) { }
}
