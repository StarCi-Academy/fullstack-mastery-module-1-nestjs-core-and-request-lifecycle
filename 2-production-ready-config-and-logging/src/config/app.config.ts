import {
    registerAs 
} from "@nestjs/config"

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
    () => ({
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
    }))
