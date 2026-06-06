package academy.starci.requestlifecycle;

/**
 * Item is a single item record in the in-memory store.
 *
 * @param id the identifier key of the item
 * @param name the display name of the item
 */
public record Item(long id, String name) {
}
