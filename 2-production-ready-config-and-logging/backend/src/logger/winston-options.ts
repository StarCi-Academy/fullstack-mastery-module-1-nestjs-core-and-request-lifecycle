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
 * Factory tạo Winston options từ ConfigService — KHÔNG đọc trực tiếp `process.env`.
 * (EN: Build Winston options from ConfigService — does NOT read `process.env` directly.)
 *
 * Lý do bài học: M0/L2 dạy ConfigModule là single source of truth cho env vars.
 * Mọi giá trị runtime đi qua `configService.get("app.X")`, tránh leak env access
 * ra ngoài config layer (xem coding-common §5.1).
 * (EN: This lesson teaches ConfigModule as the single source of truth. Every
 * runtime value flows through `configService.get("app.X")` — no env access
 * outside the config layer per coding-common §5.1.)
 *
 * @sideEffects Không ghi external state, chỉ đọc từ ConfigService và tạo transport instance.
 *   (EN: no external state mutation, only reads from ConfigService and creates transports.)
 */
export function getWinstonOptions(configService: ConfigService): WinstonModuleOptions {
    // Đọc đường dẫn file log từ namespace `app` — fallback đã set ở app.config.ts.
    // (EN: read log file path from `app` namespace — fallback already set in app.config.ts.)
    const logFile = configService.get<string>("app.logFilePath") ?? "logs/app.log"

    // Đọc tên app từ cùng namespace — dùng cho prefix log trong format nestLike.
    // (EN: read app name from the same namespace — used as nestLike prefix.)
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
