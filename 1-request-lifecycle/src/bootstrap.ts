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
    // Cổng cố định 3000 — bài L1 dạy request pipeline (middleware/guard/pipe/interceptor),
    // chưa giới thiệu ConfigModule (đó là chủ đề L2). Literal port giữ scope bài học gọn.
    // (EN: Hardcoded port 3000 — L1 teaches the request pipeline, ConfigModule arrives
    // in L2. A literal here keeps the lesson focus on pipeline ordering, not config.)
    await app.listen(3000,
        "0.0.0.0")
}
