import {
    Injectable 
} from "@nestjs/common"

@Injectable()
export class CatService {
    /**
   * Trả về danh sách mèo mẫu để smoke test endpoint `/cats` (EN: return sample cat list for `/cats` smoke test).
   *
   * @returns Array<{ id: number; name: string }> - Danh sách dữ liệu demo (EN: demo data list).
   */
    getCats() {
    // Dùng dữ liệu cố định để đảm bảo ví dụ DI tập trung vào module boundary thay vì DB setup
    // (EN: use static data so the DI lesson focuses on module boundaries instead of DB setup).
        return [
            {
                id: 1, name: "Milo" 
            },
            {
                id: 2, name: "Luna" 
            },
        ]
    }

    /**
   * Cung cấp tín hiệu phụ thuộc cho `DogService` để chứng minh cross-module injection
   * (EN: provide dependency signal for `DogService` to prove cross-module injection).
   *
   * @returns string - Chuỗi trạng thái phụ thuộc (EN: dependency status string).
   */
    getSpyHint() {
        return "cat-network-ready"
    }
}
