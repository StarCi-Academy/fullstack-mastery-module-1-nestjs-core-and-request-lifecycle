import {
    Module,
} from "@nestjs/common"
import {
    ConfigModule,
    ConfigService,
} from "@nestjs/config"
import {
    WinstonModule,
} from "nest-winston"
import {
    AppController,
} from "./app.controller"
import {
    AppService,
} from "./app.service"
import {
    appConfig,
} from "./config"
import {
    getWinstonOptions,
} from "./logger"

/**
 * Root module — composes ConfigModule (loads `app` namespace) + async
 * WinstonModule so `getWinstonOptions` factory can inject ConfigService.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                // uncomment to run with production profile).
                // ".env.production",
                ".env.local",
                ".env",
            ],
            load: [appConfig],
        }),
        WinstonModule.forRootAsync({
            // inject ConfigService so Winston reads from `app` namespace
            // instead of `process.env` directly — per coding-common §5.1.)
            useFactory: (configService: ConfigService) => getWinstonOptions(configService),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
