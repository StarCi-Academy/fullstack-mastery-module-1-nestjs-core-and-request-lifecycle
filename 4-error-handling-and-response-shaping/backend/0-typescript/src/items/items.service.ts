/**
 * Service handling item data — in-memory data + source of error kinds for the error-handling demo.
 */
import {
    Injectable,
    NotFoundException,
} from "@nestjs/common"

/**
 * Shape of an item — shared by every endpoint.
 */
export interface Item {
    id: number
    name: string
}

@Injectable()
export class ItemsService {
    // In-memory data so the lesson focuses on error handling instead of DB setup.
    private readonly items: ReadonlyArray<Item> = [
        {
            id: 1, name: "keyboard"
        },
        {
            id: 2, name: "mouse"
        },
    ]

    /**
     * Return item detail by id — throw `NotFoundException` (expected error) when missing.
     */
    findOne(id: number): Item {
        const found = this.items.find((item) => item.id === id)
        if (!found) {
            // Expected domain error: a safe message we author → the filter keeps it as-is.
            throw new NotFoundException(`Item ${id} not found`)
        }

        return found
    }

    /**
     * Simulate an unexpected runtime failure — throw a plain `Error` (not an HttpException).
     */
    explode(): never {
        // Unexpected error: the real message is unsafe → the filter masks it with "Internal server error".
        throw new Error("boom: simulated internal failure with secret detail")
    }
}
