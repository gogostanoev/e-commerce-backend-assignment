import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

describe('ProductService', () => {
  let productService: ProductService;
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

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const sampleProducts: ProductEntity[] = [{}, {}] as ProductEntity[];
      jest.spyOn(productRepository, 'find').mockResolvedValue(sampleProducts);

      const products = await productService.getProducts();

      expect(products).toEqual(sampleProducts);
    });

    it('should throw NotFoundException if no products are available', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      await expect(productService.getProducts()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getProductById', () => {
    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = null;

      await expect(
        productService.getProductById(invalidId),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should return a product when valid ID is provided', async () => {
      const mockProduct: ProductEntity = {
        id: 'valid_id',
        name: 'Shampoo',
        price: 120,
        status: 'active',
        images: [],
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const productId = '2';
      const product = await productService.getProductById(productId);

      expect(product).toEqual(mockProduct);
    });

    it('should throw NotFoundException for non-existing product', async () => {
      const nonExistingId = '55';
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        productService.getProductById(nonExistingId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const mockProductDto: ProductDto = {
        name: 'Sample Product',
        price: 99,
        status: 'active',
      };

      const mockProductEntity: ProductEntity = {
        id: '1',
        ...mockProductDto,
        images: [],
      };

      jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(mockProductEntity);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(mockProductEntity);

      const createdProduct = await productService.createProduct(mockProductDto);

      expect(createdProduct).toEqual(mockProductEntity);
      expect(productRepository.create).toHaveBeenCalledWith(mockProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(mockProductEntity);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productId = '4';
      const updateProductDto: UpdateProductDto = {
        name: 'Fish',
        price: 500,
        status: 'active',
      };

      const mockProduct: ProductEntity = {
        id: productId,
        name: 'PS5',
        price: 400,
        status: 'active',
        images: [],
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'save').mockResolvedValue({
        ...mockProduct,
        ...updateProductDto,
      });

      const updatedProduct = await productService.updateProduct(
        productId,
        updateProductDto,
      );

      expect(updatedProduct).toEqual({
        ...mockProduct,
        ...updateProductDto,
      });
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(productRepository.save).toHaveBeenCalledWith({
        ...mockProduct,
        ...updateProductDto,
      });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = null;
      const updateProductDto: UpdateProductDto = {
        name: 'Mustard',
        price: 130,
        status: 'inactive',
      };

      await expect(
        productService.updateProduct(invalidId, updateProductDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException for non-existing product', async () => {
      const nonExistingId = '33';
      const updateProductDto: UpdateProductDto = {
        name: 'Ketchup',
        price: 140,
        status: 'inactive',
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        productService.updateProduct(nonExistingId, updateProductDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productId = '3';
      const mockProduct: ProductEntity = {
        id: productId,
        name: 'Chipsy',
        price: 70,
        status: 'available',
        images: [],
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'delete').mockResolvedValue({} as any);

      const deleteResult = await productService.deleteProduct(productId);

      expect(deleteResult).toEqual(
        `The desired product has been successfully deleted ${productId}`,
      );
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(productRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = null;

      await expect(
        productService.deleteProduct(invalidId),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should throw NotFoundException for non-existing product', async () => {
      const nonExistingId = '77';
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        productService.deleteProduct(nonExistingId),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
