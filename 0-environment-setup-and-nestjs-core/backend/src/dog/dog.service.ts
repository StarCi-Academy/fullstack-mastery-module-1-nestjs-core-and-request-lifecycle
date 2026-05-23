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
    getSpyReport(): { mission: string; dependency: string; status: string } {
        return {
            mission: "cross-module-dependency-check",
            // Lấy dữ liệu từ module khác để thể hiện IoC container đang resolve đúng dependency.
            // (EN: Fetch data from another module to show IoC container resolves dependency correctly.)
            dependency: this.catService.getSpyHint(),
            status: "ok",
        }
    }

    /**
     * Mượn toàn bộ danh sách mèo từ `CatService` — chứng minh cross-module DI cho phép
     * truy cập toàn bộ API surface của service được export, không chỉ một hint.
     * (EN: Borrow the full cat list via `CatService` — proves cross-module DI grants access
     * to the exported service's entire API surface, not just a single hint.)
     */
    borrowAllCats(): { dog: string; borrowedCats: Array<{ id: number; name: string }> } {
        return {
            dog: "Rex",
            // Gọi `getCats()` của CatService để hiển thị mọi public method đều dùng được sau khi import module.
            // (EN: Call CatService's `getCats()` to show every public method becomes available after importing the module.)
            borrowedCats: this.catService.getCats(),
        }
    }
}
