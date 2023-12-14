import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockProduct, mockProducts } from '../mockData/product.mockData';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductInput, UpdateProductInput } from './dto/product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should get all the products', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue(mockProducts);

      const products = await service.getProducts();

      expect(products).toEqual(mockProducts);
    });

    it('should throw NotFoundException when no products are available', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      await expect(service.getProducts()).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProductById', () => {
    it('should get a product by ID', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const productId = '1';
      const product = await service.getProductById(productId);

      expect(product).toEqual(mockProduct);
    });

    it('should throw NotFoundExpection when product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const productId = '1';
      await expect(service.getProductById(productId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const productId = '';
      await expect(service.getProductById(productId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getImagesFromProduct', () => {
    it('should get images for a valid product ID', async () => {
      const productId = '2';

      const expectedProduct = mockProducts.find(
        (product) => product.id === productId,
      );
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(expectedProduct);

      const images = await service.getImagesFromProduct(productId);
      expect(images).toEqual(expectedProduct.images);
    });

    it('should throw NotFoundException for an invalid product ID', async () => {
      const invalidProductId = '11';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.getImagesFromProduct(invalidProductId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for a missing product ID', async () => {
      const missingProductId = null;

      await expect(
        service.getImagesFromProduct(missingProductId),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct: CreateProductInput = {
        name: 'Sparkling water',
        price: 40,
        status: 'active',
      };

      const createdProduct: ProductEntity = {
        id: '5',
        ...newProduct,
        images: [],
      };

      jest.spyOn(productRepository, 'create').mockReturnValue(createdProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(createdProduct);

      const result = await service.createProduct(newProduct);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const productId = '1';

      const updateData: UpdateProductInput = {
        name: 'Updated name',
        price: 120,
        status: 'inactive',
      };

      const existingProduct: ProductEntity = {
        id: productId,
        name: 'Existing product',
        price: 10,
        status: 'active',
        images: [],
      };

      const updatedProduct: ProductEntity = {
        ...existingProduct,
        ...updateData,
      };

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(existingProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(productId, updateData);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException for an invalid product ID', async () => {
      const invalidProductId = '30';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateProduct(invalidProductId, {} as UpdateProductInput),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for a missing product ID', async () => {
      const missingProductId = null;

      await expect(
        service.updateProduct(missingProductId, {} as UpdateProductInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const productId = '1';

      const existingProduct: ProductEntity = {
        id: productId,
        name: 'Existing Product',
        price: 50,
        status: 'active',
        images: [],
      };

      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(existingProduct);
      jest.spyOn(productRepository, 'delete').mockResolvedValue({} as any);

      const result = await service.deleteProduct(productId);
      expect(result).toContain(productId);
    });

    it('should throw BadRequestException for a missing product ID', async () => {
      const missingProductId = '';

      await expect(service.deleteProduct(missingProductId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException for an invalid product ID', async () => {
      const invalidProductId = '300';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.deleteProduct(invalidProductId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
