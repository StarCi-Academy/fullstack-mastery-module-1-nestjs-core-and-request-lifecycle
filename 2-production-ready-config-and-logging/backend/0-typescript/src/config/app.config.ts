import {
    registerAs
} from "@nestjs/config"

/**
 * App config — name, version, HTTP port, runtime environment, log file path.
 *
 * `logFilePath` + `appName` belong here because this lesson teaches
 * ConfigModule itself — every env value must route through this single config
 * layer; no stray `process.env.X` in `bootstrap.ts` or `winston-options.ts`.
 */
export interface AppConfig {
    name: string
    version: string
    port: number
    nodeEnv: string
    logFilePath: string
}

/**
 * ConfigFactory for application variables.
 * Uses registerAs() to create `app` namespace and avoid collisions with other configs.
 *
 * usage):
 *   @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>
 *   this.config.name  -> application name
 *   this.config.port  -> HTTP port
 */
export const appConfig = registerAs("app",
    (): AppConfig => ({
    // application name used in logs and observability labels).
        name: process.env.APP_NAME ?? "nestjs-config-logging-demo",

        // application version, useful when tracing concurrent deployments).
        version: process.env.APP_VERSION ?? "0.0.1",

        // HTTP port from env for flexible deployment across platforms).
        port: parseInt(process.env.PORT ?? "3000",
            10),

        // runtime environment value).
        nodeEnv: process.env.NODE_ENV ?? "local",

        // log file path — centralised so Winston reads from the same config source).
        logFilePath: process.env.LOG_FILE_PATH ?? "logs/app.log",
    }))
