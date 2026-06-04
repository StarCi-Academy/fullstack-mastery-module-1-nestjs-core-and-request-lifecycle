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
   * inject service so controller does not contain business/config logic).
   *
   * @param appService service aggregating runtime status).
   */
    constructor(private readonly appService: AppService) {}

  /**
   * handle `GET /` to return configuration and logging status).
   *
   * @returns runtime status payload).
   */
  @Get()
    getStatus(): ReturnType<AppService["getStatus"]> {
    // keep controller thin for easy extension with auth/rate-limit without touching business logic).
        this.logger.log("GET / called - returning runtime config status")
        return this.appService.getStatus()
    }

    /**
     * Handle `GET /config` — return the full `app` namespace snapshot to demonstrate
     * typed namespace-key retrieval rather than reading individual fields ad-hoc.
     */
    @Get("config")
    getConfig(): AppConfig {
        // Log so the endpoint hit is visible, supporting Flow 4's logs/app.log inspection.
        this.logger.log("GET /config called - returning AppConfig snapshot")
        return this.appService.getConfigSnapshot()
    }
}
