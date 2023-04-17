import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { errorMessages } from 'src/shared/errors';
import { EntityManager } from 'typeorm';
import { Categories, Category, CategoryIds } from './entities/category.entity';
import { Product } from './entities/product.entity';
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

  beforeEach(async () => {
    jest.clearAllMocks();
    fakeEntityManager = {
      findOne: jest.fn().mockResolvedValue(computersCategory),
      find: jest.fn(),
      save: jest.fn().mockImplementation((data) => data),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockResolvedValue(testProduct),
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
      expect(result).rejects.toThrowError(errorMessages.category.notFound.en);
    });

    it('should throw error if not found', async () => {
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
});
