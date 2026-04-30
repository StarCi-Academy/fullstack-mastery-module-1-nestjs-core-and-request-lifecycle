import {
    Module 
} from "@nestjs/common"
import {
    ConfigModule 
} from "@nestjs/config"
import {
    WinstonModule 
} from "nest-winston"
import {
    AppController 
} from "./app.controller"
import {
    AppService 
} from "./app.service"
import {
    appConfig 
} from "./config"
import {
    getWinstonOptions 
} from "./logger"

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
            useFactory: getWinstonOptions,
            inject: [],
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
