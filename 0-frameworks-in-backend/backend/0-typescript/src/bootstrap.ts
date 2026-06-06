/**
 * Bootstrap Nest app — global ValidationPipe and listen on port.
 */
import {
    NestFactory,
} from "@nestjs/core"
import {
    AppModule,
} from "./app.module"

export async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule)
    // Default port 3000 — allow override via env PORT so audit/parallel tests
    // avoid port collisions. ConfigModule is introduced in L2; here port is read
    // directly from process.env with a numeric fallback.
    const port = Number(process.env.PORT) || 3000
    await app.listen(port,
        "0.0.0.0")
}
