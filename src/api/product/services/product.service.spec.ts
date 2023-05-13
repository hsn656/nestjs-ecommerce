import { Test, TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { successObject } from 'src/common/helper/sucess-response.interceptor';
import {
  Categories,
  Category,
  CategoryIds,
} from 'src/database/entities/category.entity';
import { Product, VariationTypes } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { EntityManager } from 'typeorm';
import { ProductDetailsDto } from '../dto/product.dto';
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

  const fulfilledProduct = {
    id: 3,
    title: 'test title',
    description: 'description 1',
    about: ['about 1'],
    details: {
      brand: 'Dell',
      series: 'XPS',
      capacity: 2,
      category: 'Computers',
      capacityType: 'HD',
      capacityUnit: 'TB',
    },
    isActive: true,
    merchantId: 1,
    categoryId: 1,
  };

  const computerDetails: ComputerDetails = {
    category: Categories.Computers,
    capacity: 2,
    capacityUnit: 'TB',
    capacityType: 'HD',
    brand: 'Dell',
    series: 'XPS',
  };

  const productDetails: ProductDetailsDto = {
    details: computerDetails,
    about: ['about 1'],
    description: 'test description',
    code: 'test UPC code',
    title: 'test title',
    variationType: VariationTypes.NONE,
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
        delete: jest.fn(),
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

  describe('getProduct: get product by id', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.getProduct(1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(testProduct);
      const result = await service.getProduct(1);
      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('createProduct: create initial inActive product', () => {
    it('should throw not found category', async () => {
      fakeEntityManager.findOne = jest.fn().mockResolvedValue(null);
      const result = service.createProduct(
        {
          categoryId: 1,
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
        },
        1,
      );

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.create).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('addProductDetails: add product details by updating exising product', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0, raw: [] }),
        });
      const result = service.addProductDetails(1, productDetails, 1);

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
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest
            .fn()
            .mockResolvedValueOnce({ affected: 1, raw: [testProduct] }),
        });
      const result = await service.addProductDetails(1, productDetails, 1);

      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result.id).toBe(testProduct.id);
    });
  });

  describe('activateProduct: activate Product if its info is fulfilled', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.findOne = jest.fn().mockReturnValueOnce(null);
      const result = service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should throw error if product not fulfilled', async () => {
      fakeEntityManager.findOne = jest.fn().mockReturnValueOnce(new Product());
      const result = service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFulfilled.message,
      );
    });

    it('should success', async () => {
      const returnedActiveProduct = {
        id: 1,
        isActive: true,
      };
      fakeEntityManager.findOne = jest
        .fn()
        .mockReturnValueOnce(fulfilledProduct);

      fakeEntityManager.createQueryBuilder().update = jest
        .fn()
        .mockReturnValueOnce({
          set: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          returning: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({
            affected: 1,
            raw: [returnedActiveProduct],
          }),
        });
      const result = await service.activateProduct(1, 1);

      expect(fakeEntityManager.findOne).toBeCalled();
      expect(fakeEntityManager.createQueryBuilder().update).toBeCalled();
      expect(result.id).toBe(returnedActiveProduct.id);
      expect(result.isActive).toBe(true);
    });
  });

  describe('deleteProduct: delete product by id', () => {
    it('should throw not found product', async () => {
      fakeEntityManager.createQueryBuilder().delete = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 0, raw: [] }),
        });
      const result = service.deleteProduct(1, 1);

      expect(fakeEntityManager.createQueryBuilder().delete).toBeCalled();
      expect(result).rejects.toThrowError(
        errorMessages.product.notFound.message,
      );
    });

    it('should success', async () => {
      fakeEntityManager.createQueryBuilder().delete = jest
        .fn()
        .mockReturnValueOnce({
          from: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          execute: jest.fn().mockResolvedValueOnce({ affected: 1, raw: [] }),
        });
      const result = await service.deleteProduct(1, 1);

      expect(fakeEntityManager.createQueryBuilder().delete).toBeCalled();
      expect(result.message).toBe(successObject.message);
    });
  });
});
