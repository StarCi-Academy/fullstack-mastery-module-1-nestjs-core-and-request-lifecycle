namespace ErrorHandlingDemo.Items;

/// <summary>
/// "Not found" domain error — expected, carrying a safe message (maps to HTTP 404).
/// The middleware keeps the message as-is because this is an authored domain error.
/// </summary>
public sealed class ItemNotFoundException : Exception
{
    /// <summary>
    /// Construct with a safe, client-visible message authored by the domain.
    /// </summary>
    /// <param name="message">The safe message describing which item was not found.</param>
    public ItemNotFoundException(string message) : base(message)
    {
    }
}

/// <summary>
/// Input validation error — expected, carrying a safe message (maps to HTTP 400).
/// Thrown at the boundary when a path parameter violates a constraint.
/// </summary>
public sealed class ValidationException : Exception
{
    /// <summary>
    /// Construct with a safe message describing the violated constraint.
    /// </summary>
    /// <param name="message">Human-readable description of the validation failure.</param>
    public ValidationException(string message) : base(message)
    {
    }
}
