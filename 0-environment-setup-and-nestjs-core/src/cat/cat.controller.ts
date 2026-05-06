/**
 * Controller xử lý endpoint `/cats` — demo Module + DI.
 * (EN: Controller handling `/cats` endpoint — Module + DI demo.)
 */
import {
    Controller,
    Get,
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
    findAll() {
        // Delegate qua service để controller không chứa business/data logic.
        // (EN: Delegate to service to keep controller free of business/data logic.)
        return this.catService.getCats()
    }
}
