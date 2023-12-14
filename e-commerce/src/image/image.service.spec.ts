import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { Repository } from 'typeorm';
import { ImageEntity } from './entities/image.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateImageInput } from './dto/image.dto';

describe('ImageService', () => {
  let service: ImageService;
  let imageRepository: Repository<ImageEntity>;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(ImageEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    imageRepository = module.get<Repository<ImageEntity>>(
      getRepositoryToken(ImageEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getImageById', () => {
    it('should get an image by a valid ID', async () => {
      const imageId = '1';

      const expectedImage: ImageEntity = {
        id: imageId,
        url: 'trustworthy_url',
        priority: 1,
        product: {} as any,
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(expectedImage);

      const result = await service.getImageById(imageId);
      expect(result).toEqual(expectedImage);
    });

    it('should throw BadRequestException for a missing image ID', async () => {
      const missingImageId = null;

      await expect(service.getImageById(missingImageId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException for an invalid image ID', async () => {
      const invalidImageId = '78';

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getImageById(invalidImageId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductFromImages', () => {
    it('should get a product from an image ID', async () => {
      const imageId = '1';

      const expectedProduct: ProductEntity = {
        id: '1',
        name: 'Notebook',
        price: 25,
        status: 'active',
        images: [],
      };

      const mockImage: ImageEntity = {
        id: imageId,
        url: 'trusty_url',
        priority: 1,
        product: expectedProduct,
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);

      const result = await service.getProductFromImages(imageId);
      expect(result).toEqual(expectedProduct);
    });

    it('should throw BadRequestException for a missing image ID', async () => {
      const missingImageId = null;

      await expect(
        service.getProductFromImages(missingImageId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for an invalid image ID', async () => {
      const invalidImageId = '555';

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.getProductFromImages(invalidImageId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createImage', () => {
    it('should create an image for a valid product ID', async () => {
      const imageDto = { url: 'good_url', priority: 1000 };
      const productId = '3';
      const expectedProduct: ProductEntity = {
        id: productId,
        name: 'Chispy',
        price: 70,
        status: 'active',
        images: [],
      };

      const mockProduct: ProductEntity = {
        ...expectedProduct,
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const createdImage: ImageEntity = {
        id: '3',
        ...imageDto,
        product: mockProduct,
      };

      jest.spyOn(imageRepository, 'create').mockReturnValue(createdImage);
      jest.spyOn(imageRepository, 'save').mockResolvedValue(createdImage);

      const result = await service.createImage(imageDto, productId);
      expect(result).toEqual(createdImage);
    });

    it('should throw NotFoundException for a missing product ID', async () => {
      const imageDto = { url: 'amazing_url', priority: 1000 };
      const missingProductId = 'invalid_product_id';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createImage(imageDto, missingProductId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateImage', () => {
    it('should update an image with valid ID and input', async () => {
      const updateImageDto: UpdateImageInput = {
        url: 'new_valid_url',
        priority: 1001,
      };
      const imageId = '4';

      const mockImage: ImageEntity = {
        id: imageId,
        url: 'great_url',
        priority: 1000,
        product: null,
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);
      jest
        .spyOn(imageRepository, 'save')
        .mockImplementation((image: ImageEntity) => Promise.resolve(image));

      const result = await service.updateImage(imageId, updateImageDto);
      expect(result.url).toBe(updateImageDto.url);
      expect(result.priority).toBe(updateImageDto.priority);
    });

    it('should throw NotFoundException for a missing image ID', async () => {
      const updateImageDto: UpdateImageInput = {
        url: 'new_valid_url',
        priority: 1002,
      };
      const missingImageId = 'invalid_image_id';

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateImage(missingImageId, updateImageDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image with a valid ID', async () => {
      const imageId = '2';

      const mockImage: ImageEntity = {
        id: imageId,
        url: 'valid_url',
        priority: 1000,
        product: null,
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);
      jest.spyOn(imageRepository, 'remove').mockResolvedValue({} as any);

      const result = await service.deleteImage(imageId);
      expect(result).toBe('The image has been successfully deleted.');
    });

    it('should throw NotFoundException for a missing image ID', async () => {
      const missingImageId = '33';

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteImage(missingImageId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
