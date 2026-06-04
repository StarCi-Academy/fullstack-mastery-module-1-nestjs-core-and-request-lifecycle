/**
 * Service handling item data — in-memory data for lifecycle demo.
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class ItemsService {
    /**
     * Return sample item list for list endpoint.
     */
    findAll(): Array<{ id: number; name: string }> {
        // Return in-memory data so the lesson focuses on pipeline instead of DB setup.
        return [
            {
                id: 1, name: "keyboard"
            },
            {
                id: 2, name: "mouse"
            },
        ]
    }

    /**
     * Return item detail by id that has passed pipe validation.
     */
    findOne(id: number): { id: number; name: string } {
        return {
            id, name: `item-${id}`
        }
    }
}
