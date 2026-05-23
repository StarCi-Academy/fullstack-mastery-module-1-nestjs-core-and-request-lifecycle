/**
 * Controller xử lý endpoint `/cats` — demo Module + DI.
 * (EN: Controller handling `/cats` endpoint — Module + DI demo.)
 */
import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
} from "@nestjs/common"
import {
    CatService,
} from "./cat.service"

@Controller("cats")
export class CatController {
    /**
     * Inject `CatService` để controller chỉ giữ routing responsibility.
     * (EN: Inject `CatService` so controller only keeps routing responsibility.)
     */
    constructor(private readonly catService: CatService) {}

    /**
     * Xử lý `GET /cats` và trả dữ liệu từ service.
     * (EN: Handle `GET /cats` and return data from service.)
     */
    @Get()
    findAll(): Array<{ id: number; name: string }> {
        // Delegate qua service để controller không chứa business/data logic.
        // (EN: Delegate to service to keep controller free of business/data logic.)
        return this.catService.getCats()
    }

    /**
     * Xử lý `GET /cats/:id` — minh hoạ path param + built-in `ParseIntPipe`.
     * (EN: Handle `GET /cats/:id` — demonstrates path param + built-in `ParseIntPipe`.)
     */
    @Get(":id")
    findOne(@Param("id",
        ParseIntPipe) id: number): { id: number; name: string } {
        // Tìm trong service; nếu không có thì throw `NotFoundException` để Nest trả 404 chuẩn.
        // (EN: Look up via service; throw `NotFoundException` so Nest returns a standard 404.)
        const cat = this.catService.findById(id)
        if (!cat) {
            throw new NotFoundException(`Cat with id ${id} not found`)
        }
        return cat
    }
}
