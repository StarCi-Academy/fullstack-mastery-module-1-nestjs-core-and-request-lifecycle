import {
    Controller, Get 
} from "@nestjs/common"
import {
    CatService 
} from "./cat.service"

@Controller("cats")
export class CatController {
    /**
   * Inject `CatService` để controller chỉ giữ routing responsibility
   * (EN: inject `CatService` so controller only keeps routing responsibility).
   *
   * @param catService - Service xử lý dữ liệu mèo (EN: service handling cat data).
   */
    constructor(private readonly catService: CatService) {}

  /**
   * Xử lý `GET /cats` và trả dữ liệu từ service
   * (EN: handle `GET /cats` and return data from service).
   *
   * @returns Array<{ id: number; name: string }> - Danh sách mèo mẫu (EN: sample cat list).
   */
  @Get()
    findAll() {
    // Delegate qua service để controller không chứa business/data logic
    // (EN: delegate to service to keep controller free of business/data logic).
        return this.catService.getCats()
    }
}
