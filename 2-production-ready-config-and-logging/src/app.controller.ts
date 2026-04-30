import {
    Controller, Get, Logger 
} from "@nestjs/common"
import {
    AppService 
} from "./app.service"

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name)

    /**
   * Inject service để controller không chứa business/config logic
   * (EN: inject service so controller does not contain business/config logic).
   *
   * @param appService - Service tổng hợp trạng thái runtime (EN: service aggregating runtime status).
   */
    constructor(private readonly appService: AppService) {}

  /**
   * Xử lý `GET /` để trả trạng thái cấu hình và logging
   * (EN: handle `GET /` to return configuration and logging status).
   *
   * @returns object - Payload trạng thái runtime (EN: runtime status payload).
   */
  @Get()
    getStatus() {
    // Giữ controller mỏng để dễ mở rộng thêm auth/rate-limit mà không ảnh hưởng business logic
    // (EN: keep controller thin for easy extension with auth/rate-limit without touching business logic).
        this.logger.log("GET / called - returning runtime config status")
        return this.appService.getStatus()
    }
}
