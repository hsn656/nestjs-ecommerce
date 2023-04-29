import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import {
  Categories,
  Category,
  CategoryIds,
} from 'src/database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { EntityManager } from 'typeorm';
import { ComputerDetails } from '../dto/productDetails/computer.details';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let fakeEntityManager: Partial<EntityManager>;
  const computersCategory = {
    id: CategoryIds.Computers,
    name: Categories.Computers,
  } as Category;
  const testProduct = {
    id: 1,
    title: 'test title',
    category: computersCategory,
    merchantId: 1,
  } as Product;

  const computerDetails: ComputerDetails = {
    category: Categories.Computers,
    capacity: 2,
    capacityUnit: 'TB',
    capacityType: 'HD',
    brand: 'Dell',
    series: 'XPS',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeEntityManager = {
      findOne: jest.fn().mockResolvedValue(computersCategory),
      find: jest.fn(),
      save: jest.fn().mockImplementation((data) => data),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockResolvedValue(testProduct),
      createQueryBuilder: jest.fn().mockReturnValue({
        update: jest.fn(),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getEntityManagerToken(),
          useValue: fakeEntityManager,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct: create initial inActive product', () => {
    it('should throw not found category', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.createProduct(
        {
          categoryId: 1,
          title: 'test title',
        },
        1,
      );

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.category.notFound.message,
      );
    });

    it('should success', async () => {
      const result = await service.createProduct(
        {
          categoryId: 1,
          title: 'test title',
        },
        1,
      );

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.create).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('addProductDetails: add product details by updating exising product', () => {
    it('should throw not found category', async () => {
      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0, raw: [] }),
        });
      const result = service.addProductDetails(1, computerDetails, 1);

      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest
            .fn()
            .mockResolvedValueOnce({ affected: 1, raw: [testProduct] }),
        });
      const result = await service.addProductDetails(1, computerDetails, 1);

      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });
});
