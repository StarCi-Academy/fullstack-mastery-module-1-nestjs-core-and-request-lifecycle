/**
 * Controller xử lý endpoint `/items` — demo request lifecycle pipeline.
 * (EN: Controller handling `/items` endpoint — request lifecycle pipeline demo.)
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
     * Xử lý `GET /items/restricted` được bảo vệ bằng `RoleGuard` — chỉ `?role=admin`
     * được đi qua; các role khác bị Guard chặn với HTTP 403 trước khi đến handler.
     * (EN: Handle `GET /items/restricted` protected by `RoleGuard` — only `?role=admin`
     * passes; other roles are blocked by the Guard with HTTP 403 before the handler runs.)
     */
    @UseGuards(RoleGuard)
    @Get("restricted")
    findAllRestricted(): Array<{ id: number; name: string }> {
        // Đặt route riêng để không ảnh hưởng các flow boot/routing đã có.
        // (EN: Use a dedicated route so existing boot/routing flows are not affected.)
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
