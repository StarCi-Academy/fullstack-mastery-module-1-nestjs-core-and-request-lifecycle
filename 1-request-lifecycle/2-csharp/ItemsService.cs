namespace RequestLifecycle;

/// ItemsService provides in-memory item data so the lesson focuses on the pipeline.
/// </summary>
public class ItemsService
{
    /// List returns the sample item list for the list endpoint.
    /// </summary>
    public IEnumerable<Item> List()
    {
        // Return in-memory data so there is no DB dependency.
        return new[]
        {
            new Item { Id = 1, Name = "keyboard" },
            new Item { Id = 2, Name = "mouse" },
        };
    }

    /// FindById returns the item detail by id that has passed validation.
    /// </summary>
    public Item FindById(int id)
    {
        // Log to prove the action does NOT run when model validation blocks bad input.
        Console.WriteLine($"[service] FindById({id})");
        return new Item { Id = id, Name = $"item-{id}" };
    }
}
