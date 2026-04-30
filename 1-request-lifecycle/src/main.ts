import {
    NestFactory 
} from "@nestjs/core"
import {
    AppModule 
} from "./app.module"

/**
 * Bootstrap ứng dụng cho bài request lifecycle
 * (EN: bootstrap application for request-lifecycle lesson).
 *
 * @returns Promise<void> - Hoàn tất khi app bắt đầu listen cổng HTTP
 * (EN: resolves when app starts listening on HTTP port).
 * @sideEffects Tạo HTTP server và kích hoạt toàn bộ middleware/guard/interceptor/pipes
 * (EN: creates HTTP server and activates middleware/guard/interceptor/pipes).
 */
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
