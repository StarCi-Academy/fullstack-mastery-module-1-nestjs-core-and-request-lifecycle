import {
    Injectable
} from "@nestjs/common"
import {
    ConfigService
} from "@nestjs/config"
import type {
    AppConfig,
} from "./config"

@Injectable()
export class AppService {
    /**
   * Inject config service để endpoint status phản ánh runtime config thật
   * (EN: inject config service so status endpoint reflects real runtime configuration).
   *
   * @param configService - Service truy xuất config namespace (EN: service for configuration namespaces).
   */
    constructor(private readonly configService: ConfigService) {}

    /**
   * Trả trạng thái cấu hình/logging hiện tại của ứng dụng
   * (EN: return current application configuration/logging status).
   *
   * - Payload trạng thái runtime (EN: runtime status payload).
   */
    getStatus(): {
        message: string
        env: string
        appName: string | undefined
        appVersion: string | undefined
        appPort: number | undefined
    } {
        const env = this.configService.get<string>("app.nodeEnv") ?? "local"
        const appName = this.configService.get<string>("app.name")
        return {
            message: `${appName} - config-and-logging-ready`,
            // Report env để QA xác nhận app đang chạy đúng profile
            // (EN: report env so QA can verify app is running with the expected profile).
            env,
            appName: this.configService.get<string>("app.name"),
            appVersion: this.configService.get<string>("app.version"),
            appPort: this.configService.get<number>("app.port"),
        }
    }

    /**
     * Trả snapshot toàn bộ namespace `app` của ConfigService — minh hoạ cách
     * truy xuất typed config qua key namespace duy nhất, không đụng tới `process.env`.
     * (EN: Return the entire `app` namespace snapshot from ConfigService — demonstrates
     * typed config retrieval via a single namespace key, without touching `process.env`.)
     */
    getConfigSnapshot(): AppConfig {
        // Lấy theo key namespace `app` để TypeScript narrow toàn bộ shape AppConfig.
        // (EN: Retrieve by `app` namespace key so TypeScript narrows the full AppConfig shape.)
        const snapshot = this.configService.get<AppConfig>("app")
        if (!snapshot) {
            // Trường hợp này chỉ xảy ra khi ConfigModule chưa load namespace `app` — báo lỗi sớm.
            // (EN: This only occurs if ConfigModule has not loaded the `app` namespace — fail fast.)
            throw new Error("ConfigService namespace 'app' is not loaded")
        }
        return snapshot
    }
}
