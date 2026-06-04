package academy.starci.requestlifecycle;

import java.util.List;
import org.springframework.stereotype.Service;

/**
 * ItemsService provides in-memory item data so the lesson focuses on the pipeline.
 */
@Service
public class ItemsService {
    /**
     * findAll returns the sample item list for the list endpoint.
     *
     * @return the in-memory item list
     */
    public List<Item> findAll() {
        // Return in-memory data so there is no DB dependency.
        return List.of(new Item(1, "keyboard"), new Item(2, "mouse"));
    }

    /**
     * findById returns the item detail by id that has passed validation.
     *
     * @param id item id validated by Bean Validation
     * @return the corresponding item
     */
    public Item findById(long id) {
        // Log to prove the handler does NOT run when Bean Validation blocks bad input.
        System.out.println("[service] findById(" + id + ")");
        return new Item(id, "item-" + id);
    }
}
