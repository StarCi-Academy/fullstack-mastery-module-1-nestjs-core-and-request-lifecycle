/**
 * Khởi tạo Nest app với Winston logger — ValidationPipe toàn cục và lắng nghe cổng.
 * (EN: Bootstrap Nest app with Winston logger — global ValidationPipe and listen on port.)
 */
import {
    NestFactory,
} from "@nestjs/core"
import {
    ValidationPipe,
} from "@nestjs/common"
import {
    ConfigService,
} from "@nestjs/config"
import {
    WINSTON_MODULE_NEST_PROVIDER,
} from "nest-winston"
import {
    AppModule,
} from "./app.module"

export async function bootstrap(): Promise<void> {
    // Tắt logger mặc định để tránh log trùng và bảo đảm toàn bộ log đi qua Winston pipeline.
    // (EN: Disable default logger to avoid duplicate logs and ensure all logs go through Winston pipeline.)
    const app = await NestFactory.create(AppModule,
        {
            logger: false,
        })
    // Dùng provider chuẩn của nest-winston để giữ integration đúng lifecycle của Nest.
    // (EN: Use nest-winston provider to keep integration aligned with Nest lifecycle.)
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: false,
    }))
    // Lấy port từ ConfigService — KHÔNG đọc `process.env.PORT` trực tiếp.
    // Bài học chính là về ConfigModule, nên mọi env value phải route qua đây.
    // (EN: Resolve port via ConfigService — do NOT touch `process.env.PORT` here.
    // This lesson teaches ConfigModule, so every env value must flow through it.)
    const configService = app.get(ConfigService)
    const port = configService.get<number>("app.port") ?? 3000
    await app.listen(port,
        "0.0.0.0")
}
