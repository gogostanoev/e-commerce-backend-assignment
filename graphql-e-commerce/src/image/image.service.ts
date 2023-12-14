import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../image/entities/image.entity';
import { Repository } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { CreateImageInput, UpdateImageInput } from './dto/image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(ImageEntity)
        private readonly imageRepository: Repository<ImageEntity>,
        
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) {}

    async getImages(): Promise<ImageEntity[]> {
        const images = await this.imageRepository.find();

        if (images.length === 0) {
            throw new NotFoundException(`No images were found.`)
        };

        return images;
    }

    async getImageById(ID: string): Promise<ImageEntity> {
        if (!ID) {
            throw new BadRequestException(`Invalid ID, please provid a valid image ID`)
        };

        const image = await this.imageRepository.findOne({ where: { id: ID } })
        
        if (!image) {
            throw new NotFoundException(`Image with id ${ID} not found`)
        };

        return image;
    }

    async getProductFromImages(imageId: string): Promise<ProductEntity> {
        if (!imageId) {
            throw new BadRequestException(`Image with ID ${imageId} not found.`)
        };

        const image = await this.imageRepository.findOne({
            where: { id: imageId },
            relations: ['product']
        });
        
        if (!image) {
            throw new NotFoundException(`Image not found.`)
        };

        return image.product;
    }

    async createImage(imageDto: CreateImageInput, productId: string): Promise<ImageEntity> {
        const product = await this.productRepository.findOne({ where: { id: productId } });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found.`)
        };

        const newImage = this.imageRepository.create({
            ...imageDto,
            product: product
        });

        const createdImage = await this.imageRepository.save(newImage);

        return createdImage;
    }

    async updateImage(ID: string, updateImageDto: UpdateImageInput): Promise<ImageEntity> {
        const image = await this.imageRepository.findOne({ where: { id: ID } });

        if (!image) {
            throw new NotFoundException(`Image with ID ${ID} not found.`)
        };

        if (updateImageDto.url) {
            image.url = updateImageDto.url;
        };
    
        if (updateImageDto.priority) {
            image.priority = updateImageDto.priority;
        };

        const updatedImage = await this.imageRepository.save(image);

        return updatedImage;
    }

    async deleteImage (ID: string): Promise<string> {
        const image = await this.imageRepository.findOne({ where: { id: ID } });

        if (!image) {
            throw new NotFoundException(`Image with id ${ID} not found.`)
        };

        await this.imageRepository.remove(image);
        return `The image has been successfully deleted.`
    }
}
