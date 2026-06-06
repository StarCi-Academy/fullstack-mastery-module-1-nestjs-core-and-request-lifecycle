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
    // Hardcoded port 3000 — L0 teaches DI + module boundaries, ConfigModule
    // is introduced in L2. Keeping a literal here keeps the lesson scope tight.)
    await app.listen(3000,
        "0.0.0.0")
}
