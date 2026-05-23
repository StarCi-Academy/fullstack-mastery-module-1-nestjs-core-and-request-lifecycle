import {
    registerAs
} from "@nestjs/config"

/**
 * Cấu hình app (tên, version, port HTTP, môi trường runtime, đường dẫn file log).
 * (EN: App config — name, version, HTTP port, runtime environment, log file path.)
 *
 * Lý do gộp `logFilePath` + `appName` vào đây: bài học chính là về ConfigModule,
 * nên mọi giá trị mà code đọc từ env phải đi qua đúng config layer này — không
 * được phép có `process.env.X` rải rác ở `bootstrap.ts` hoặc `winston-options.ts`.
 * (EN: `logFilePath` + `appName` belong here because this lesson teaches
 * ConfigModule itself — every env value must route through this single config
 * layer; no stray `process.env.X` in `bootstrap.ts` or `winston-options.ts`.)
 */
export interface AppConfig {
    name: string
    version: string
    port: number
    nodeEnv: string
    logFilePath: string
}

/**
 * appConfig — ConfigFactory cho các biến cấu hình ứng dụng.
 * Dùng registerAs() để tạo namespace `app`, tránh đụng độ với config khác.
 * (EN: ConfigFactory for application variables.
 * Uses registerAs() to create `app` namespace and avoid collisions with other configs.)
 *
 * Cách dùng (EN: usage):
 *   @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>
 *   this.config.name  -> application name
 *   this.config.port  -> HTTP port
 */
export const appConfig = registerAs("app",
    (): AppConfig => ({
    // Tên ứng dụng — dùng trong log và label hệ thống quan sát
    // (EN: application name used in logs and observability labels).
        name: process.env.APP_NAME ?? "nestjs-config-logging-demo",

        // Phiên bản ứng dụng — hữu ích khi trace nhiều version chạy song song
        // (EN: application version, useful when tracing concurrent deployments).
        version: process.env.APP_VERSION ?? "0.0.1",

        // Cổng HTTP — đọc từ env để deploy linh hoạt trên nhiều nền tảng
        // (EN: HTTP port from env for flexible deployment across platforms).
        port: parseInt(process.env.PORT ?? "3000",
            10),

        // Môi trường runtime: local | development | staging | production
        // (EN: runtime environment value).
        nodeEnv: process.env.NODE_ENV ?? "local",

        // Đường dẫn file log — cấu hình tập trung để Winston đọc cùng nguồn config
        // (EN: log file path — centralised so Winston reads from the same config source).
        logFilePath: process.env.LOG_FILE_PATH ?? "logs/app.log",
    }))
