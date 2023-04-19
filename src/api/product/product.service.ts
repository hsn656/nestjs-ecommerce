import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateProductDto } from './product.dto';
import { Category } from './entities/category.entity';
import { errorMessages } from 'src/shared/errors';
import { ProductDetails } from './productDetails';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createProduct(data: CreateProductDto, merchantId: number) {
    const category = await this.entityManager.findOne(Category, {
      where: {
        id: data.categoryId,
      },
    });

    if (!category)
      throw new NotFoundException(errorMessages.category.notFound.en);

    const product = await this.entityManager.create(Product, {
      title: data.title,
      category,
      merchantId,
    });

    return this.entityManager.save(product);
  }

  async addProductDetails(
    productId,
    details: ProductDetails,
    merchantId: number,
  ) {
    const result = await this.entityManager
      .createQueryBuilder()
      .update(Product)
      .set({ details, merchantId })
      .where('id = :id', { id: productId })
      .returning(['id', 'title', 'details'])
      .execute();
    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound.en);
    return result.raw[0];
  }
}
