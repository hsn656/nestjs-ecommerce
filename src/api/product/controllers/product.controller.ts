import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard, ProtectedRequest } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { RoleIds } from '../../role/enum/role.enum';
import {
  CreateProductDto,
  FindOneParams,
  ProductDetailsDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';

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
    @Param() product: FindOneParams,
    @Body() body: ProductDetailsDto,
    @Req() req: ProtectedRequest,
  ) {
    return this.productService.addProductDetails(product.id, body, req.user.id);
  }

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/activate')
  async activateProduct(
    @Param() product: FindOneParams,
    @Req() req: ProtectedRequest,
  ) {
    return this.productService.activateProduct(product.id, req.user.id);
  }
}
