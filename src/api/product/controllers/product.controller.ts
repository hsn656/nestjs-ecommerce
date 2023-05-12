import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/guards/roles.decorator';
import { RoleIds } from '../../role/enum/role.enum';
import {
  CreateProductDto,
  FindOneParams,
  ProductDetailsDto,
} from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { PayloadDto } from 'src/api/auth/dto/auth.dto';
import { User } from 'src/api/auth/guards/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post('create')
  async createProduct(
    @Body() body: CreateProductDto,
    @User() user: PayloadDto,
  ) {
    return this.productService.createProduct(body, user.id);
  }

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/details')
  async addProductDetails(
    @Param() product: FindOneParams,
    @Body() body: ProductDetailsDto,
    @User() user: PayloadDto,
  ) {
    return this.productService.addProductDetails(product.id, body, user.id);
  }

  @Roles(RoleIds.Merchant, RoleIds.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post(':id/activate')
  async activateProduct(
    @Param() product: FindOneParams,
    @User() user: PayloadDto,
  ) {
    return this.productService.activateProduct(product.id, user.id);
  }
}
