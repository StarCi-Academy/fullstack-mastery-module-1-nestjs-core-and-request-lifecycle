/**
 * Khởi tạo Nest app cho bài request lifecycle — ValidationPipe toàn cục và lắng nghe cổng.
 * (EN: Bootstrap Nest app for request-lifecycle lesson — global ValidationPipe and listen on port.)
 */
import {
    NestFactory,
} from "@nestjs/core"
import {
    ValidationPipe,
} from "@nestjs/common"
import {
    AppModule,
} from "./app.module"

export async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: false,
    }))
    // Cổng mặc định 3000 — bài L1 dạy request pipeline (middleware/guard/pipe/interceptor),
    // chưa giới thiệu ConfigModule (đó là chủ đề L2). Cho phép override bằng env `PORT`
    // để audit/parallel test không đụng port mà không lệ thuộc ConfigModule.
    // (EN: Default port 3000 — L1 teaches the request pipeline, ConfigModule arrives
    // in L2. Allow override via env `PORT` so audit/parallel tests can avoid port
    // collisions without pulling in ConfigModule.)
    const port = Number(process.env.PORT) || 3000
    await app.listen(port,
        "0.0.0.0")
}
