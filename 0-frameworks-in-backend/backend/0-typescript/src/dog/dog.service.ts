/**
 * Service handling spy report flow — calls CatService via cross-module DI.
 */
import {
    Injectable,
} from "@nestjs/common"
import {
    CatService,
} from "../cat"

@Injectable()
export class DogService {
    /**
     * Inject `CatService` to verify exported/imported dependency across modules.
     */
    constructor(private readonly catService: CatService) {}

    /**
     * Create spy report to prove `DogService` can call `CatService` without manual instantiation.
     */
    getSpyReport(): { mission: string; dependency: string; status: string } {
        return {
            mission: "cross-module-dependency-check",
            // Fetch data from another module to show IoC container resolves dependency correctly.
            dependency: this.catService.getSpyHint(),
            status: "ok",
        }
    }

    /**
     * Borrow the full cat list via `CatService` — proves cross-module DI grants access
     * to the exported service's entire API surface, not just a single hint.
     */
    borrowAllCats(): { dog: string; borrowedCats: Array<{ id: number; name: string }> } {
        return {
            dog: "Rex",
            // Call CatService's `getCats()` to show every public method becomes available after importing the module.
            borrowedCats: this.catService.getCats(),
        }
    }
}
