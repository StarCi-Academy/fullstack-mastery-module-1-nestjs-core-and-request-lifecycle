namespace RequestLifecycle;

/// <summary>
/// Item is a single item record in the in-memory store.
/// </summary>
public record Item
{
    /// <summary>Id is the identifier key of the item.</summary>
    public int Id { get; init; }

    /// <summary>Name is the display name of the item.</summary>
    public string Name { get; init; } = string.Empty;
}
