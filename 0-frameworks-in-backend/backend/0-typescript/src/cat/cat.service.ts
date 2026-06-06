/**
 * Service handling cat data — provides demo data and cross-module hint.
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class CatService {
    /**
     * Shared sample dataset used by all methods to avoid duplication.
     */
    private readonly cats: Array<{ id: number; name: string }> = [
        {
            id: 1, name: "Milo"
        },
        {
            id: 2, name: "Luna"
        },
    ]

    /**
     * Return sample cat list for `/cats` smoke test.
     */
    getCats(): Array<{ id: number; name: string }> {
        // Use static data so DI lesson focuses on module boundaries instead of DB setup.
        return this.cats
    }

    /**
     * Return one cat by id — demonstrates path param + service findById.
     */
    findById(id: number): { id: number; name: string } | undefined {
        // Linear lookup is acceptable for the small static dataset; the lesson focuses on DI, not DB.
        return this.cats.find((cat) => cat.id === id)
    }

    /**
     * Provide dependency signal for `DogService` to prove cross-module injection.
     */
    getSpyHint(): string {
        return "cat-network-ready"
    }
}
