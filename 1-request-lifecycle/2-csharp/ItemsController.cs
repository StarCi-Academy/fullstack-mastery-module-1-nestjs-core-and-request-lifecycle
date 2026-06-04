using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace RequestLifecycle;

/// ItemsController handles the /items endpoint — request lifecycle pipeline demo.
/// </summary>
[ApiController]
[Route("items")]
public class ItemsController : ControllerBase
{
    /// _service is the business layer providing item data.
    /// </summary>
    private readonly ItemsService _service;

    /// Inject the service to keep the controller thin and testable.
    /// </summary>
    public ItemsController(ItemsService service) => _service = service;

    /// List handles GET /items to fetch the item list.
    /// </summary>
    [HttpGet]
    public IEnumerable<Item> List() => _service.List();

    /// Restricted handles GET /items/restricted, guarded by RoleActionFilter (only role=admin).
    /// </summary>
    [HttpGet("restricted")]
    [ServiceFilter(typeof(RoleActionFilter))]
    public IEnumerable<Item> Restricted() => _service.List();

    /// FindById handles GET /items/{id} with mandatory [Range] model validation.
    /// </summary>
    [HttpGet("{id}")]
    public Item FindById([Range(1, int.MaxValue, ErrorMessage = "id must be a positive integer")] int id)
        => _service.FindById(id);
}
