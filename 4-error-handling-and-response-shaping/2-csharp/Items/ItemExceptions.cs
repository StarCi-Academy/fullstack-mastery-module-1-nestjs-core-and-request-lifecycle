namespace ErrorHandlingDemo.Items;

/// "Not found" domain error — expected, carrying a safe message (→ 404).
/// </summary>
public sealed class ItemNotFoundException : Exception
{
    /// Construct with a safe message authored by the domain.
    /// </summary>
    public ItemNotFoundException(string message) : base(message)
    {
    }
}

/// Input validation error — expected, carrying a safe message (→ 400).
/// </summary>
public sealed class ValidationException : Exception
{
    /// Construct with a safe message describing the violated constraint.
    /// </summary>
    public ValidationException(string message) : base(message)
    {
    }
}
