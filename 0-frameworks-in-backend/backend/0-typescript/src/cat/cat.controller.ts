/**
 * Controller handling `/cats` endpoint — Module + DI demo.
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
     * Inject `CatService` so controller only keeps routing responsibility.
     */
    constructor(private readonly catService: CatService) {}

    /**
     * Handle `GET /cats` and return data from service.
     */
    @Get()
    findAll(): Array<{ id: number; name: string }> {
        // Delegate to service to keep controller free of business/data logic.
        return this.catService.getCats()
    }

    /**
     * Handle `GET /cats/:id` — demonstrates path param + built-in `ParseIntPipe`.
     */
    @Get(":id")
    findOne(@Param("id",
        ParseIntPipe) id: number): { id: number; name: string } {
        // Look up via service; throw `NotFoundException` so Nest returns a standard 404.
        const cat = this.catService.findById(id)
        if (!cat) {
            throw new NotFoundException(`Cat with id ${id} not found`)
        }
        return cat
    }
}
