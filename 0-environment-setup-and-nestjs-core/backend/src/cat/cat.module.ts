/**
 * CatModule — đăng ký controller + service, export CatService cho DogModule.
 * (EN: CatModule — registers controller + service, exports CatService for DogModule.)
 */
import {
    Module,
} from "@nestjs/common"
import {
    CatController,
} from "./cat.controller"
import {
    CatService,
} from "./cat.service"

@Module({
    controllers: [CatController],
    providers: [CatService],
    exports: [CatService],
})
export class CatModule {}
