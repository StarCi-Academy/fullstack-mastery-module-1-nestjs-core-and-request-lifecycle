/**
 * Controller xử lý endpoint `/dogs/spy` — demo cross-module dependency.
 * (EN: Controller handling `/dogs/spy` endpoint — cross-module dependency demo.)
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
     * Inject service để controller giữ đúng vai trò orchestration.
     * (EN: Inject service so controller stays as an orchestration layer.)
     */
    constructor(private readonly dogService: DogService) {}

    /**
     * Xử lý `GET /dogs/spy` cho bài test cross-module dependency.
     * (EN: Handle `GET /dogs/spy` for cross-module dependency test.)
     */
    @Get("spy")
    spy() {
        // Không đặt logic nghiệp vụ ở controller để giữ code dễ test và maintain.
        // (EN: Keep business logic out of controller for easier testing and maintenance.)
        return this.dogService.getSpyReport()
    }
}
