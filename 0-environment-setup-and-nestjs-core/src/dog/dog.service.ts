/**
 * Service xử lý luồng spy report — gọi CatService qua cross-module DI.
 * (EN: Service handling spy report flow — calls CatService via cross-module DI.)
 */
import {
    Injectable,
} from "@nestjs/common"
import {
    CatService,
} from "../cat"

@Injectable()
export class DogService {
    /**
     * Inject `CatService` để kiểm chứng dependency export/import giữa module.
     * (EN: Inject `CatService` to verify exported/imported dependency across modules.)
     */
    constructor(private readonly catService: CatService) {}

    /**
     * Sinh báo cáo spy để chứng minh `DogService` gọi được `CatService` không cần `new`.
     * (EN: Create spy report to prove `DogService` can call `CatService` without manual instantiation.)
     */
    getSpyReport() {
        return {
            mission: "cross-module-dependency-check",
            // Lấy dữ liệu từ module khác để thể hiện IoC container đang resolve đúng dependency.
            // (EN: Fetch data from another module to show IoC container resolves dependency correctly.)
            dependency: this.catService.getSpyHint(),
            status: "ok",
        }
    }
}
