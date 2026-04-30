import {
    Controller, Get 
} from "@nestjs/common"
import {
    DogService 
} from "./dog.service"

@Controller("dogs")
export class DogController {
    /**
   * Inject service để controller giữ đúng vai trò orchestration
   * (EN: inject service so controller stays as an orchestration layer).
   *
   * @param dogService - Service xử lý luồng spy report (EN: service handling spy-report flow).
   */
    constructor(private readonly dogService: DogService) {}

  /**
   * Xử lý `GET /dogs/spy` cho bài test cross-module dependency
   * (EN: handle `GET /dogs/spy` for cross-module dependency test).
   *
   * (EN: DI verification payload).
   */
  @Get("spy")
    spy() {
    // Không đặt logic nghiệp vụ ở controller để giữ code dễ test và maintain
    // (EN: keep business logic out of controller for easier testing and maintenance).
        return this.dogService.getSpyReport()
    }
}
