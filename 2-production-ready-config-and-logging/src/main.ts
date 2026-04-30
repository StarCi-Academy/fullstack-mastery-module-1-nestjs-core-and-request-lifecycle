import {
    NestFactory 
} from "@nestjs/core"
import {
    WINSTON_MODULE_NEST_PROVIDER 
} from "nest-winston"
import {
    AppModule 
} from "./app.module"

/**
 * Bootstrap ứng dụng với logger thống nhất từ Winston
 * (EN: bootstrap application with unified Winston logger).
 *
 * @returns Promise<void> - Hoàn tất khi app bắt đầu listen cổng HTTP
 * (EN: resolves when app starts listening on HTTP port).
 * @sideEffects Khởi tạo HTTP server và override logger mặc định của Nest
 * (EN: initializes HTTP server and overrides Nest default logger).
 */
async function bootstrap(): Promise<void> {
    // Tắt logger mặc định để tránh log trùng và bảo đảm toàn bộ log đi qua Winston pipeline
    // (EN: disable default logger to avoid duplicate logs and ensure all logs go through Winston pipeline).
    const app = await NestFactory.create(AppModule,
        {
            logger: false 
        })
    // Dùng provider chuẩn của nest-winston để giữ integration đúng lifecycle của Nest
    // (EN: use nest-winston provider to keep integration aligned with Nest lifecycle).
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
