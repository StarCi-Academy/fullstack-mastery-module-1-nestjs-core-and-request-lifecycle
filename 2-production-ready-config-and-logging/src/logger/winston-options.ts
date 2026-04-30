import {
    utilities as nestWinstonModuleUtilities,
} from "nest-winston"
import * as winston from "winston"

/**
 * Tạo cấu hình Winston theo runtime env để đồng bộ behavior local/prod
 * (EN: create Winston configuration by runtime environment to align local/prod behavior).
 *
 * @sideEffects Không ghi external state, chỉ đọc env và tạo transport instance
 * (EN: no external state mutation, only reads env and creates transport instances).
 */
export function getWinstonOptions() {
    const logFile = process.env.LOG_FILE_PATH ?? "logs/app.log"
    const appName = process.env.APP_NAME ?? "nestjs-config-logging-demo"
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
