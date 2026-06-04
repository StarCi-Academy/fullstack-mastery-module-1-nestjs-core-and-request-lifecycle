import {
    utilities as nestWinstonModuleUtilities,
} from "nest-winston"
import type {
    WinstonModuleOptions,
} from "nest-winston"
import {
    ConfigService,
} from "@nestjs/config"
import * as winston from "winston"

/**
 * Build Winston options from ConfigService — does NOT read `process.env` directly.
 *
 * This lesson teaches ConfigModule as the single source of truth. Every
 * runtime value flows through `configService.get("app.X")` — no env access
 * outside the config layer per coding-common §5.1.
 *
 *   no external state mutation, only reads from ConfigService and creates transports.
 */
export function getWinstonOptions(configService: ConfigService): WinstonModuleOptions {
    // read log file path from `app` namespace — fallback already set in app.config.ts.
    const logFile = configService.get<string>("app.logFilePath") ?? "logs/app.log"

    // read app name from the same namespace — used as nestLike prefix.
    const appName = configService.get<string>("app.name") ?? "nestjs-config-logging-demo"

    const jsonFormat = winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    )
    const nestLikeFormat = winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(appName),
    )

    return {
        transports: [
            new winston.transports.Console({
                format: nestLikeFormat,
            }),
            new winston.transports.File({
                filename: logFile,
                format: jsonFormat,
            }),
        ],
    }
}
