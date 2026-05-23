import {
    Controller, Get, Logger
} from "@nestjs/common"
import {
    AppService
} from "./app.service"
import type {
    AppConfig,
} from "./config"

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
    getStatus(): ReturnType<AppService["getStatus"]> {
    // Giữ controller mỏng để dễ mở rộng thêm auth/rate-limit mà không ảnh hưởng business logic
    // (EN: keep controller thin for easy extension with auth/rate-limit without touching business logic).
        this.logger.log("GET / called - returning runtime config status")
        return this.appService.getStatus()
    }

    /**
     * Xử lý `GET /config` — trả snapshot toàn bộ namespace `app` để minh hoạ
     * truy xuất config qua key namespace (typed) thay vì đọc lẻ từng field.
     * (EN: Handle `GET /config` — return the full `app` namespace snapshot to demonstrate
     * typed namespace-key retrieval rather than reading individual fields ad-hoc.)
     */
    @Get("config")
    getConfig(): AppConfig {
        // Log để xác nhận endpoint chạy, phục vụ Flow 4 quan sát logs/app.log.
        // (EN: Log so the endpoint hit is visible, supporting Flow 4's logs/app.log inspection.)
        this.logger.log("GET /config called - returning AppConfig snapshot")
        return this.appService.getConfigSnapshot()
    }
}
