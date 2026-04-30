import {
    Controller, Get, Param 
} from "@nestjs/common"
import {
    ItemsService 
} from "./items.service"
import {
    ParsePositiveIntPipe 
} from "./parse-positive-int.pipe"

@Controller("items")
export class ItemsController {
    /**
   * Inject service để giữ controller mỏng và dễ test
   * (EN: inject service to keep controller thin and testable).
   *
   * @param itemsService - Service xử lý dữ liệu item (EN: service handling item data).
   */
    constructor(private readonly itemsService: ItemsService) {}

  /**
   * Xử lý `GET /items` để lấy danh sách item
   * (EN: handle `GET /items` to fetch item list).
   *
   * @returns Array<{ id: number; name: string }> - Danh sách item mẫu (EN: sample item list).
   */
  @Get()
    findAll() {
    // Tách biệt routing và business để giảm coupling khi mở rộng endpoint
    // (EN: separate routing from business logic to reduce coupling when scaling endpoints).
        return this.itemsService.findAll()
    }

  /**
   * Xử lý `GET /items/:id` với pipe validation bắt buộc
   * (EN: handle `GET /items/:id` with mandatory pipe validation).
   *
   * @param id - ID item đã parse/validate bởi `ParsePositiveIntPipe`
   * (EN: item id parsed/validated by `ParsePositiveIntPipe`).
   */
  @Get(":id")
  findOne(@Param("id",
      ParsePositiveIntPipe) id: number) {
      return this.itemsService.findOne(id)
  }
}
