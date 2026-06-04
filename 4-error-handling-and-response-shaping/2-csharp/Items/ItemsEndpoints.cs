namespace ErrorHandlingDemo.Items;

/// Map endpoints for the items feature — raise 3 error kinds to demo the error convergence point.
/// </summary>
public static class ItemsEndpoints
{
    /// Register the `/items/...` routes onto the pipeline.
    /// </summary>
    public static void MapItemsEndpoints(this WebApplication app)
    {
        var service = new ItemService();

        // GET /items/explode — trigger an unexpected runtime error (declared before the param route).
        app.MapGet("/items/explode", () => Results.Json(service.Explode()));

        // GET /items/{id} — validate id (400) before business logic, throw 404 if missing.
        app.MapGet("/items/{id}", (string id) =>
        {
            // Validate at the boundary: only accept a positive integer.
            if (!int.TryParse(id, out var parsed) || parsed <= 0)
            {
                throw new ValidationException("id must be a positive integer");
            }

            return Results.Json(service.Find(parsed));
        });
    }
}
