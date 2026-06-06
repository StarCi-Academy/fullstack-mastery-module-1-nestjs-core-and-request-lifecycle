namespace ErrorHandlingDemo.Items;

/// <summary>
/// Endpoint registration for the items feature.
/// Raises 3 error kinds to demonstrate the error convergence middleware.
/// </summary>
public static class ItemsEndpoints
{
    /// <summary>
    /// Register the <c>/items/...</c> routes onto the WebApplication pipeline.
    /// </summary>
    /// <param name="app">The WebApplication to register routes on.</param>
    public static void MapItemsEndpoints(this WebApplication app)
    {
        // Instantiate the service inline — dependency injection is a later lesson.
        var service = new ItemService();

        // GET /items/explode — trigger an unexpected runtime error (declared before the param route).
        // The middleware's catch-all branch will intercept and return 500 with a generic message.
        app.MapGet("/items/explode", () => Results.Json(service.Explode()));

        // GET /items/{id} — validate id (400) before business logic, throw 404 if missing.
        app.MapGet("/items/{id}", (string id) =>
        {
            // Validate at the boundary: only accept a positive integer.
            // TryParse handles non-numeric strings; the second condition rejects zero and negatives.
            if (!int.TryParse(id, out var parsed) || parsed <= 0)
            {
                throw new ValidationException("id must be a positive integer");
            }

            // Delegate to service — throws ItemNotFoundException (→ 404) if not found.
            return Results.Json(service.Find(parsed));
        });
    }
}
