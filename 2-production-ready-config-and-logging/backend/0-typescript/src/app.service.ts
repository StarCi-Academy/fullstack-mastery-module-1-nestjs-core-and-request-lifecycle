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
   * inject config service so status endpoint reflects real runtime configuration).
   *
   * @param configService service for configuration namespaces).
   */
    constructor(private readonly configService: ConfigService) {}

    /**
   * return current application configuration/logging status).
   *
   * -  runtime status payload).
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
            // report env so QA can verify app is running with the expected profile).
            env,
            appName: this.configService.get<string>("app.name"),
            appVersion: this.configService.get<string>("app.version"),
            appPort: this.configService.get<number>("app.port"),
        }
    }

    /**
     * Return the entire `app` namespace snapshot from ConfigService — demonstrates
     * typed config retrieval via a single namespace key, without touching `process.env`.
     */
    getConfigSnapshot(): AppConfig {
        // Retrieve by `app` namespace key so TypeScript narrows the full AppConfig shape.
        const snapshot = this.configService.get<AppConfig>("app")
        if (!snapshot) {
            // This only occurs if ConfigModule has not loaded the `app` namespace — fail fast.
            throw new Error("ConfigService namespace 'app' is not loaded")
        }
        return snapshot
    }
}
