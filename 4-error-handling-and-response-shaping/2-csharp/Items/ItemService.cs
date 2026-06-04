namespace ErrorHandlingDemo.Items;

/// Shape of an item, shared by every endpoint.
/// </summary>
public sealed record Item(int Id, string Name);

/// Service handling in-memory item data + source of error kinds for the error-handling demo.
/// </summary>
public sealed class ItemService
{
    // In-memory data so the lesson focuses on error handling instead of DB setup.
    private readonly List<Item> _items = new()
    {
        new Item(1, "keyboard"),
        new Item(2, "mouse"),
    };

    /// Return item detail by id — throw ItemNotFoundException (expected error) when missing.
    /// </summary>
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

    /// Simulate an unexpected runtime failure — throw a plain Exception (not an expected error).
    /// </summary>
    public Item Explode()
    {
        // Unexpected error: the real message is unsafe → the middleware masks it with "Internal server error".
        throw new Exception("boom: simulated internal failure with secret detail");
    }
}
