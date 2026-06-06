/**
 * Bootstrap Nest app with Winston logger — global ValidationPipe and listen on port.
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
    // Disable default logger to avoid duplicate logs and ensure all logs go through Winston pipeline.
    const app = await NestFactory.create(AppModule,
        {
            logger: false,
        })
    // Use nest-winston provider to keep integration aligned with Nest lifecycle.
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: false,
    }))
    // Resolve port via ConfigService — do NOT touch `process.env.PORT` here.
    // This lesson teaches ConfigModule, so every env value must flow through it.)
    const configService = app.get(ConfigService)
    const port = configService.get<number>("app.port") ?? 3000
    await app.listen(port,
        "127.0.0.1")
}
