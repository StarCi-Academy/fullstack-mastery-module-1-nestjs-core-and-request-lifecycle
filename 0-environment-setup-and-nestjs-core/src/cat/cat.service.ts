/**
 * Service xử lý dữ liệu mèo — cung cấp demo data và cross-module hint.
 * (EN: Service handling cat data — provides demo data and cross-module hint.)
 */
import {
    Injectable,
} from "@nestjs/common"

@Injectable()
export class CatService {
    /**
     * Trả về danh sách mèo mẫu để smoke test endpoint `/cats`.
     * (EN: Return sample cat list for `/cats` smoke test.)
     */
    getCats() {
        // Dùng dữ liệu cố định để bài DI tập trung vào module boundary thay vì DB setup.
        // (EN: Use static data so DI lesson focuses on module boundaries instead of DB setup.)
        return [
            { id: 1, name: "Milo" },
            { id: 2, name: "Luna" },
        ]
    }

    /**
     * Cung cấp tín hiệu phụ thuộc cho `DogService` để chứng minh cross-module injection.
     * (EN: Provide dependency signal for `DogService` to prove cross-module injection.)
     */
    getSpyHint() {
        return "cat-network-ready"
    }
}
