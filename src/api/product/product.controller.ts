import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, ProtectedRequest } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleIds } from '../role/role.enum';
import { CreateProductDto, ProductDetailsDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  async createProduct(
    @Body() body: CreateProductDto,
    @Req() req: ProtectedRequest,
  ) {
    return this.productService.createProduct(body, req.user.id);
  }

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/details')
  async addProductDetails(
    @Param('id') productId: number,
    @Body() body: ProductDetailsDto,
    @Req() req: ProtectedRequest,
  ) {
    return this.productService.addProductDetails(
      productId,
      body.details,
      req.user.id,
    );
  }
}
