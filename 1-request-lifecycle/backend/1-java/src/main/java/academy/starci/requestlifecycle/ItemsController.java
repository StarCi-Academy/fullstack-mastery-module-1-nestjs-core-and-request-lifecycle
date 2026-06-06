package academy.starci.requestlifecycle;

import jakarta.validation.constraints.Min;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ItemsController handles the /items endpoint — request lifecycle pipeline demo.
 */
@RestController
@Validated
@RequestMapping("/items")
public class ItemsController {
    /**
     * service is the business layer providing item data.
     */
    private final ItemsService service;

    /**
     * Inject the service to keep the controller thin and testable.
     *
     * @param service the item business layer
     */
    public ItemsController(ItemsService service) {
        this.service = service;
    }

    /**
     * findAll handles GET /items to fetch the item list.
     *
     * @return the item list
     */
    @GetMapping
    public List<Item> findAll() {
        return service.findAll();
    }

    /**
     * findAllRestricted handles GET /items/restricted; RoleInterceptor blocks role != admin before the handler.
     *
     * @return the item list
     */
    @GetMapping("/restricted")
    public List<Item> findAllRestricted() {
        return service.findAll();
    }

    /**
     * findById handles GET /items/{id} with mandatory @Min(1) Bean Validation.
     *
     * @param id item id, must be a positive integer
     * @return the corresponding item
     */
    @GetMapping("/{id}")
    public Item findById(@PathVariable @Min(value = 1, message = "id must be a positive integer") long id) {
        return service.findById(id);
    }
}
