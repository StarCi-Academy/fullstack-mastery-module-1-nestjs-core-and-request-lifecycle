/**
 * Controller handling `/items` endpoint — raises 3 error kinds to demo the error convergence point.
 */
import {
    Controller,
    Get,
    Param,
} from "@nestjs/common"
import type {
    Item,
} from "./items.service"
import {
    ItemsService,
} from "./items.service"
import {
    ParsePositiveIntPipe,
} from "../common"

@Controller("items")
export class ItemsController {
    /**
     * Inject service to keep controller thin and testable.
     */
    constructor(private readonly itemsService: ItemsService) { }

    /**
     * Handle `GET /items/explode` — trigger an unexpected runtime error (static route, declared before `:id`).
     */
    @Get("explode")
    explode(): never {
        return this.itemsService.explode()
    }

    /**
     * Handle `GET /items/:id` — pipe validates (400) before the handler, service throws 404 if missing.
     */
    @Get(":id")
    findOne(@Param("id",
        ParsePositiveIntPipe) id: number): Item {
        return this.itemsService.findOne(id)
    }
}
