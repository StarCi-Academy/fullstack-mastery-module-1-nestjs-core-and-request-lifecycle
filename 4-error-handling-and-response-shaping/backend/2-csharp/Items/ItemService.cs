namespace ErrorHandlingDemo.Items;

/// <summary>
/// Shape of an item, shared by every endpoint as the happy-path response.
/// </summary>
/// <param name="Id">Unique item identifier.</param>
/// <param name="Name">Human-readable item name.</param>
public sealed record Item(int Id, string Name);

/// <summary>
/// Service providing in-memory item data and acting as the source of all
/// error kinds used in the error-handling demonstration lesson.
/// </summary>
public sealed class ItemService
{
    // In-memory data so the lesson focuses on error handling instead of DB setup.
    private readonly List<Item> _items = new()
    {
        new Item(1, "keyboard"),
        new Item(2, "mouse"),
    };

    /// <summary>
    /// Return item detail by id — throw <see cref="ItemNotFoundException"/>
    /// (expected domain error) when the item does not exist.
    /// </summary>
    /// <param name="id">Positive integer identifier of the item.</param>
    /// <returns>The matching <see cref="Item"/>.</returns>
    /// <exception cref="ItemNotFoundException">
    /// Thrown when no item with the given id exists — maps to HTTP 404.
    /// </exception>
    public Item Find(int id)
    {
        var found = _items.FirstOrDefault(i => i.Id == id);
        if (found is null)
        {
            // Expected domain error: a safe message we author → the middleware keeps it as-is.
            throw new ItemNotFoundException($"Item {id} not found");
        }

        return found;
    }

    /// <summary>
    /// Simulate an unexpected runtime failure by throwing a plain <see cref="Exception"/>
    /// (not a typed domain error). The middleware's catch-all will mask it with a generic message.
    /// </summary>
    /// <returns>Never returns — always throws.</returns>
    /// <exception cref="Exception">
    /// Unexpected error containing internal detail — masked by the middleware to protect secrets.
    /// </exception>
    public Item Explode()
    {
        // Unexpected error: the real message is unsafe → the middleware masks it with "Internal server error".
        throw new Exception("boom: simulated internal failure with secret detail");
    }
}
