import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from './image.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageEntity } from '../image/entities/image.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ImageService', () => {
  let imageService: ImageService;
  let imageRepository: Repository<ImageEntity>;
  let productRepository: Repository<ProductEntity>

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

    imageService = module.get<ImageService>(ImageService);
    imageRepository = module.get<Repository<ImageEntity>>(
      getRepositoryToken(ImageEntity),
    );
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  describe('getImages', () => {
    it('should return images', async () => {
      const mockImages: ImageEntity[] = [
        {
          id: '1',
          url: "https://notebook/image.jpg",
          priority: 1,
          product: null, 
        },
        {
          id: '2',
          url: 'https://water-bottle/image.jpg',
          priority: 2,
          product: null,
        },
      ];

      jest.spyOn(imageRepository, 'find').mockResolvedValue(mockImages);

      const images = await imageService.getImages();

      expect(images).toEqual(mockImages);
      expect(imageRepository.find).toHaveBeenCalledWith({ relations: ['product'] });
    });

    it('should throw NotFoundException if no images are found', async () => {
      jest.spyOn(imageRepository, 'find').mockResolvedValue([]);

      await expect(imageService.getImages()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getImageById', () => {
    it('should return an image when valid ID is provided', async () => {
      const mockImage: ImageEntity = {
        id: '1',
        url: 'random_image_url.jpg',
        priority: 1,
        product: null, 
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);

      const image = await imageService.getImageById('image_id_1');

      expect(image).toEqual(mockImage);
      expect(imageRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'image_id_1' },
        relations: ['product'],
      });
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const invalidId = null;

      await expect(imageService.getImageById(invalidId)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw NotFoundException for non-existing image', async () => {
      const nonExistingId = '123';
      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        imageService.getImageById(nonExistingId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createImage', () => {
    it('should create an image associated with a product', async () => {
      const productId = '1'; 
      const mockProduct: ProductEntity = {
        id: productId,
        name: 'Pen',
        price: 20,
        status: 'inactive',
        images: []
      };

      const mockImageDto = {
        url: 'image_url',
        priority: 1,
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(mockProduct);

      const createdImage: ImageEntity = {
        id: '4',
        ...mockImageDto,
        product: mockProduct,
      };

      jest.spyOn(imageRepository, 'create').mockReturnValue(createdImage);
      jest.spyOn(imageRepository, 'save').mockResolvedValue(createdImage);

      const result = await imageService.createImage(mockImageDto, productId);

      expect(result).toEqual(createdImage);
      expect(imageRepository.create).toHaveBeenCalledWith({
        ...mockImageDto,
        product: mockProduct,
      });
      expect(imageRepository.save).toHaveBeenCalledWith({
        ...createdImage,
        product: mockProduct,
      });
    });

    it('should throw NotFoundException for non-existing product', async () => {
      const nonExistingProductId = '76';
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const mockImageDto = {
        url: 'chocolate_bunny.jpg',
        priority: 1,
      };

      await expect(
        imageService.createImage(mockImageDto, nonExistingProductId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateImage', () => {
    it('should update an existing image', async () => {
      const imageId = '3';
      const mockImage: ImageEntity = {
        id: imageId,
        url: 'old_url',
        priority: 1,
        product: new ProductEntity
      };

      const updateDto = {
        url: 'new_url',
        priority: 2,
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);
      jest.spyOn(imageRepository, 'save').mockImplementation((entity) => {
        const updatedEntity = {
          ...(entity as ImageEntity)
        }
        return Promise.resolve(updatedEntity);
      });

      const updatedImage = await imageService.updateImage(imageId, updateDto);

      expect(updatedImage.url).toBe(updateDto.url);
      expect(updatedImage.priority).toBe(updateDto.priority);
      expect(imageRepository.findOne).toHaveBeenCalledWith({ where: { id: imageId } });
      expect(imageRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
    });

    it('should throw NotFoundException for non-existing image', async () => {
      const nonExistingImageId = '774';
      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(undefined);

      const updateDto = {
        url: 'watch_url.jpg',
        priority: 2,
      };

      await expect(
        imageService.updateImage(nonExistingImageId, updateDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('deleteImage', () => {
    it('should delete an existing image', async () => {
      const imageId = '3';
      const mockImage: ImageEntity = {
        id: imageId,
        url: 'whiskey_image.jpg',
        priority: 1,
        product: new ProductEntity
      };

      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(mockImage);
      jest.spyOn(imageRepository, 'remove').mockResolvedValue(mockImage);

      const result = await imageService.deleteImage(imageId);

      expect(result).toBe('The image has been successfully deleted.');
      expect(imageRepository.findOne).toHaveBeenCalledWith({ where: { id: imageId } });
      expect(imageRepository.remove).toHaveBeenCalledWith(mockImage);
    });

    it('should throw NotFoundException for non-existing image', async () => {
      const nonExistingImageId = '44';
      jest.spyOn(imageRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        imageService.deleteImage(nonExistingImageId),
      ).rejects.toThrowError(NotFoundException);
    });
  });
})
