import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { ImageEntity } from '../image/entities/image.entity';
import { CreateProductInput, UpdateProductInput } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>
    ) { }

    async getProducts(): Promise<ProductEntity[]> {
        const products = await this.productRepository.find()

        if (products.length === 0) {
            throw new NotFoundException(`No products are currently available`);
        }

        return products;
    }

    async getProductById(ID: string): Promise<ProductEntity> {
        if (!ID) {
            throw new BadRequestException(`Invalid ID, please provide a valid product ID!`)
        }

        const product = await this.productRepository.findOne({ where: { id: ID } })

        if (!product) {
            throw new NotFoundException(`Product with id ${ID} not found.`)
        }

        return product;
    }

    async getImagesFromProduct(productId: string): Promise<ImageEntity[]> {
        if (!productId) {
            throw new BadRequestException(`Product with ID ${productId} not found.`)
        }

        const product = await this.productRepository.findOne({
            where: { id: productId },
            relations: ['images']
        });

        if (!product) {
            throw new NotFoundException(`Product not found.`)
        };

        return product.images;
    }

    async createProduct(productDto: CreateProductInput): Promise<ProductEntity> {
        const product: CreateProductInput = {
            ...productDto,
            name: productDto.name,
            price: productDto.price,
            status: productDto.status,
        };

        const createdProduct = this.productRepository.create(product);
        return await this.productRepository.save(createdProduct)
    }

    async updateProduct(ID: string, updateProductDto: UpdateProductInput): Promise<ProductEntity> {
        if (!ID) {
            throw new BadRequestException(`Invalid ID, please provide a valid product ID!`)
        };

        const product = await this.productRepository.findOne({ where: { id: ID } })

        if (!product) {
            throw new NotFoundException(`Product with ID ${ID} not found.`)
        };

        product.name = updateProductDto.name || product.name;
        product.price = updateProductDto.price || product.price;
        product.status = updateProductDto.status || product.status;

        const updatedProduct = await this.productRepository.save(product);
        return updatedProduct;
    };

    async deleteProduct(ID: string): Promise<string> {
        if (!ID) {
            throw new BadRequestException(`Invalid ID, please provide a valid product ID!`);
        };
    
        const product = await this.productRepository.findOne({ where: { id: ID } });
    
        if (!product) {
            throw new NotFoundException(`Product with id ${ID} not found.`);
        };
    
        await this.productRepository.delete(ID);
        return `The desired product has been successfully deleted ${ID}`;
    };
}
