import {
    Module 
} from "@nestjs/common"
import {
    CatModule 
} from "../cat"
import {
    DogController 
} from "./dog.controller"
import {
    DogService 
} from "./dog.service"

@Module({
    imports: [CatModule],
    controllers: [DogController],
    providers: [DogService],
})
export class DogModule {}
