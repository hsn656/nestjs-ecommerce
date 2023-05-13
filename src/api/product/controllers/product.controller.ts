import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoleIds } from '../../role/enum/role.enum';
import { CreateProductDto, ProductDetailsDto } from '../dto/product.dto';
import { ProductService } from '../services/product.service';
import { Auth } from 'src/api/auth/guards/auth.decorator';
import { FindOneParams } from 'src/common/helper/findOneParams.dto';
import { CurrentUser } from 'src/api/auth/guards/user.decorator';
import { User } from 'src/database/entities/user.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  async getProduct(@Param() product: FindOneParams) {
    return this.productService.getProduct(product.id);
  }

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Post('create')
  async createProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.createProduct(body, user.id);
  }

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Post(':id/details')
  async addProductDetails(
    @Param() product: FindOneParams,
    @Body() body: ProductDetailsDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.addProductDetails(product.id, body, user.id);
  }

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Post(':id/activate')
  async activateProduct(
    @Param() product: FindOneParams,
    @CurrentUser() user: User,
  ) {
    return this.productService.activateProduct(product.id, user.id);
  }

  @Auth(RoleIds.Admin, RoleIds.Merchant)
  @Delete(':id')
  async deleteProduct(
    @Param() product: FindOneParams,
    @CurrentUser() user: User,
  ) {
    return this.productService.deleteProduct(product.id, user.id);
  }
}
