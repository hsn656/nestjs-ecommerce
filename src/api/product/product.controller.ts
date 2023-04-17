import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleIds } from '../role/role.enum';
import { CreateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  async createProduct(@Body() body: CreateProductDto, @Req() req: any) {
    return this.productService.createProduct(body, req.user.id);
  }
}
