/**
 * Bootstrap Nest app for error-handling lesson — register ValidationPipe and listen on port.
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
    // Default port 3000 — allow override via env `PORT` so audit/parallel tests
    // avoid port collisions. The config layer (ConfigModule) is a later lesson (L2).)
    const port = Number(process.env.PORT) || 3000
    await app.listen(port,
        "0.0.0.0")
}
