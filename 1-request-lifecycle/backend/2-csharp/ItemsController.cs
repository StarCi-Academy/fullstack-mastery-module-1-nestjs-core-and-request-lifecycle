using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace RequestLifecycle;

/// <summary>
/// ItemsController handles the /items endpoint — request lifecycle pipeline demo.
/// Controller is kept thin: no role check or timing logic here (those live in filters/middleware).
/// </summary>
[ApiController]
[Route("items")]
public class ItemsController : ControllerBase
{
    /// <summary>_service is the business layer providing item data.</summary>
    private readonly ItemsService _service;

    /// <summary>
    /// Inject the service to keep the controller thin and testable.
    /// </summary>
    /// <param name="service">The item business layer.</param>
    public ItemsController(ItemsService service) => _service = service;

    /// <summary>
    /// List handles GET /items to fetch the item list.
    /// </summary>
    /// <returns>The full item list.</returns>
    [HttpGet]
    public IEnumerable<Item> List() => _service.List();

    /// <summary>
    /// Restricted handles GET /items/restricted, guarded by RoleActionFilter.
    /// Only requests with role=admin reach this action; others get HTTP 403 from the filter.
    /// </summary>
    /// <returns>The full item list for authorized callers.</returns>
    [HttpGet("restricted")]
    [ServiceFilter(typeof(RoleActionFilter))]
    public IEnumerable<Item> Restricted() => _service.List();

    /// <summary>
    /// FindById handles GET /items/{id} with mandatory [Range] model validation.
    /// ModelState validation (400) fires before this action runs, proving the pipeline order.
    /// </summary>
    /// <param name="id">Item id, must be a positive integer.</param>
    /// <returns>The corresponding item.</returns>
    [HttpGet("{id}")]
    public Item FindById([Range(1, int.MaxValue, ErrorMessage = "id must be a positive integer")] int id)
        => _service.FindById(id);
}
