import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateProductDto, ProductDetailsDto } from '../dto/product.dto';
import { Category } from '../../../database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';

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

    if (!category) throw new NotFoundException(errorMessages.category.notFound);

    const product = await this.entityManager.create(Product, {
      title: data.title,
      category,
      merchantId,
    });

    return this.entityManager.save(product);
  }

  async addProductDetails(
    productId: number,
    body: ProductDetailsDto,
    merchantId: number,
  ) {
    const result = await this.entityManager
      .createQueryBuilder()
      .update<Product>(Product)
      .set({
        details: body.details,
        about: body.about,
        description: body.description,
      })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id'])
      .execute();
    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);
    return result.raw[0];
  }

  async activateProduct(productId: number, merchantId: number) {
    const product = await this.entityManager.findOne(Product, {
      where: {
        id: productId,
        merchantId: merchantId,
      },
    });
    if (!product) throw new NotFoundException(errorMessages.product.notFound);
    const errors = await validate(product);

    if (errors.length > 0)
      throw new ConflictException(errorMessages.product.notFulfilled);

    const result = await this.entityManager
      .createQueryBuilder()
      .update<Product>(Product)
      .set({
        isActive: true,
      })
      .where('id = :id', { id: productId })
      .returning(['id', 'isActive'])
      .execute();

    return result.raw[0];
  }
}
