/**
 * Module gốc — gom CatModule + DogModule để demo Module boundary và DI.
 * (EN: Root module — aggregates CatModule + DogModule to demo Module boundary and DI.)
 */
import {
    Module,
} from "@nestjs/common"
import {
    CatModule,
} from "./cat"
import {
    DogModule,
} from "./dog"

@Module({
    imports: [CatModule, DogModule],
})
export class AppModule {}
