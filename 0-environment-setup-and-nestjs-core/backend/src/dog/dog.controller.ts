/**
 * Controller xử lý endpoint `/dogs/*` — demo cross-module dependency.
 * (EN: Controller handling `/dogs/*` endpoint — cross-module dependency demo.)
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
    spy(): { mission: string; dependency: string; status: string } {
        // Không đặt logic nghiệp vụ ở controller để giữ code dễ test và maintain.
        // (EN: Keep business logic out of controller for easier testing and maintenance.)
        return this.dogService.getSpyReport()
    }

    /**
     * Xử lý `GET /dogs/cats-via-di` — minh hoạ cross-module DI expose toàn bộ API
     * surface của `CatService`, không chỉ một method hint duy nhất.
     * (EN: Handle `GET /dogs/cats-via-di` — demonstrates cross-module DI exposing
     * the full `CatService` API surface, not just a single hint method.)
     */
    @Get("cats-via-di")
    borrowAllCats(): { dog: string; borrowedCats: Array<{ id: number; name: string }> } {
        return this.dogService.borrowAllCats()
    }
}
