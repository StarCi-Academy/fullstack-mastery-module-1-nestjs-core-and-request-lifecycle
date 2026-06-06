/**
 * Controller handling `/dogs/*` endpoint — cross-module dependency demo.
 */
import {
    Controller,
    Get,
} from "@nestjs/common"
import {
    DogService,
} from "./dog.service"

@Controller("dogs")
export class DogController {
    /**
     * Inject service so controller stays as an orchestration layer.
     */
    constructor(private readonly dogService: DogService) {}

    /**
     * Handle `GET /dogs/spy` for cross-module dependency test.
     */
    @Get("spy")
    spy(): { mission: string; dependency: string; status: string } {
        // Keep business logic out of controller for easier testing and maintenance.
        return this.dogService.getSpyReport()
    }

    /**
     * Handle `GET /dogs/cats-via-di` — demonstrates cross-module DI exposing
     * the full `CatService` API surface, not just a single hint method.
     */
    @Get("cats-via-di")
    borrowAllCats(): { dog: string; borrowedCats: Array<{ id: number; name: string }> } {
        return this.dogService.borrowAllCats()
    }
}
