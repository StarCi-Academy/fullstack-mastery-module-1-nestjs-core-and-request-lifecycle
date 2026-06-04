/**
 * Controller handling `/items` endpoint — request lifecycle pipeline demo.
 */
import {
    Controller,
    Get,
    Param,
    UseGuards,
} from "@nestjs/common"
import {
    ItemsService,
} from "./items.service"
import {
    ParsePositiveIntPipe,
    RoleGuard,
} from "../common"

@Controller("items")
export class ItemsController {
    /**
     * Inject service to keep controller thin and testable.
     */
    constructor(private readonly itemsService: ItemsService) { }

    /**
     * Handle `GET /items` to fetch item list.
     */
    @Get()
    findAll(): Array<{ id: number; name: string }> {
        // Separate routing from business logic to reduce coupling when scaling endpoints.
        return this.itemsService.findAll()
    }

    /**
     * Handle `GET /items/restricted` protected by `RoleGuard` — only `?role=admin`
     * passes; other roles are blocked by the Guard with HTTP 403 before the handler runs.
     */
    @UseGuards(RoleGuard)
    @Get("restricted")
    findAllRestricted(): Array<{ id: number; name: string }> {
        // Use a dedicated route so existing boot/routing flows are not affected.
        return this.itemsService.findAll()
    }

    /**
     * Handle `GET /items/:id` with mandatory pipe validation.
     */
    @Get(":id")
    findOne(@Param("id",
        ParsePositiveIntPipe) id: number): { id: number; name: string } {
        return this.itemsService.findOne(id)
    }
}
