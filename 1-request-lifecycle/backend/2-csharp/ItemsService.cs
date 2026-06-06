namespace RequestLifecycle;

/// <summary>
/// ItemsService provides in-memory item data so the lesson focuses on the pipeline, not database setup.
/// </summary>
public class ItemsService
{
    /// <summary>
    /// List returns the sample item list for the list endpoint.
    /// </summary>
    /// <returns>An in-memory collection of items.</returns>
    public IEnumerable<Item> List()
    {
        // Return in-memory data so there is no DB dependency for this lesson.
        return new[]
        {
            new Item { Id = 1, Name = "keyboard" },
            new Item { Id = 2, Name = "mouse" },
        };
    }

    /// <summary>
    /// FindById returns the item detail by id that has already passed model validation.
    /// A log line proves the action does NOT run when validation blocks bad input.
    /// </summary>
    /// <param name="id">Item id validated by [Range] on the controller parameter.</param>
    /// <returns>The corresponding item.</returns>
    public Item FindById(int id)
    {
        // Log to prove the action does NOT run when model validation blocks bad input.
        Console.WriteLine($"[service] FindById({id})");
        return new Item { Id = id, Name = $"item-{id}" };
    }
}
