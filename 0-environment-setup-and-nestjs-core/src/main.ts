import {
    NestFactory 
} from "@nestjs/core"
import {
    AppModule 
} from "./app.module"

/**
 * Bootstrap ứng dụng demo cho bài Module + DI
 * (EN: bootstrap demo application for Module + DI lesson).
 *
 * @returns Promise<void> - Hoàn tất khi app đã listen cổng HTTP (EN: resolves after app starts listening).
 * @sideEffects Mở HTTP server để phục vụ endpoint `/cats` và `/dogs/spy`
 * (EN: opens HTTP server for `/cats` and `/dogs/spy` endpoints).
 */
async function bootstrap(): Promise<void> {
    // Dùng fallback 3000 để người học chạy nhanh mà không cần cấu hình thêm
    // (EN: use port fallback 3000 so learners can run quickly without extra configuration).
    const app = await NestFactory.create(AppModule)
    await app.listen(process.env.PORT ?? 3000)
}

void bootstrap()
