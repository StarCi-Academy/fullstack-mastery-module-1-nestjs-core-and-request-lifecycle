import {
    Injectable 
} from "@nestjs/common"
import {
    ConfigService 
} from "@nestjs/config"

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
    getStatus() {
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
}
