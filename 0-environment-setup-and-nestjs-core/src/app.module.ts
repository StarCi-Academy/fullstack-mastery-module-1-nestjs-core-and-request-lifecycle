import {
    Module 
} from "@nestjs/common"
import {
    CatModule 
} from "./cat"
import {
    DogModule 
} from "./dog"

@Module({
    imports: [CatModule,
        DogModule],
})
export class AppModule {}
