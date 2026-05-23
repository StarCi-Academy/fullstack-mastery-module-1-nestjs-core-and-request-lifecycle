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
 * Root module — gom ConfigModule (load namespace `app`) + WinstonModule chạy async
 * để inject ConfigService vào factory `getWinstonOptions`.
 * (EN: Root module — composes ConfigModule (loads `app` namespace) + async
 * WinstonModule so `getWinstonOptions` factory can inject ConfigService.)
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                // Hủy comment để chạy với profile production
                // (EN: uncomment to run with production profile).
                // ".env.production",
                ".env.local",
                ".env",
            ],
            load: [appConfig],
        }),
        WinstonModule.forRootAsync({
            // Inject ConfigService để Winston đọc cấu hình từ namespace `app`
            // thay vì đọc `process.env` trực tiếp — tuân thủ coding-common §5.1.
            // (EN: inject ConfigService so Winston reads from `app` namespace
            // instead of `process.env` directly — per coding-common §5.1.)
            useFactory: (configService: ConfigService) => getWinstonOptions(configService),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
