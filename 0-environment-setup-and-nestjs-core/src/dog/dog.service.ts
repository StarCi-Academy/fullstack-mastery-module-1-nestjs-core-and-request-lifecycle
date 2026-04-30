import {
    Injectable 
} from "@nestjs/common"
import {
    CatService 
} from "../cat"

@Injectable()
export class DogService {
    /**
   * Inject `CatService` để kiểm chứng dependency export/import giữa module
   * (EN: inject `CatService` to verify exported/imported dependency across modules).
   *
   * @param catService - Service được export từ `CatModule` (EN: service exported from `CatModule`).
   */
    constructor(private readonly catService: CatService) {}

    /**
   * Sinh báo cáo spy để chứng minh `DogService` gọi được `CatService` không cần `new`
   * (EN: create spy report to prove `DogService` can call `CatService` without manual instantiation).
   *
   */
    getSpyReport() {
        return {
            mission: "cross-module-dependency-check",
            // Lấy dữ liệu từ module khác để thể hiện IoC container đang resolve đúng dependency
            // (EN: fetch data from another module to show IoC container resolves dependency correctly).
            dependency: this.catService.getSpyHint(),
            status: "ok",
        }
    }
}
