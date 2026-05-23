/**
 * Controller xử lý endpoint `/items` — demo request lifecycle pipeline.
 * (EN: Controller handling `/items` endpoint — request lifecycle pipeline demo.)
 */
import {
    Controller,
    Get,
    Param,
} from "@nestjs/common"
import {
    ItemsService,
} from "./items.service"
import {
    ParsePositiveIntPipe,
} from "../common"

@Controller("items")
export class ItemsController {
    /**
     * Inject service để giữ controller mỏng và dễ test.
     * (EN: Inject service to keep controller thin and testable.)
     */
    constructor(private readonly itemsService: ItemsService) { }

    /**
     * Xử lý `GET /items` để lấy danh sách item.
     * (EN: Handle `GET /items` to fetch item list.)
     */
    @Get()
    findAll(): Array<{ id: number; name: string }> {
        // Tách biệt routing và business để giảm coupling khi mở rộng endpoint.
        // (EN: Separate routing from business logic to reduce coupling when scaling endpoints.)
        return this.itemsService.findAll()
    }

    /**
     * Xử lý `GET /items/:id` với pipe validation bắt buộc.
     * (EN: Handle `GET /items/:id` with mandatory pipe validation.)
     */
    @Get(":id")
    findOne(@Param("id",
        ParsePositiveIntPipe) id: number): { id: number; name: string } {
        return this.itemsService.findOne(id)
    }
}
