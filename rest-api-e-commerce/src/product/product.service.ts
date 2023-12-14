import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find({
      relations: ['images'],
    });

    if (products.length === 0) {
      throw new NotFoundException(`No products are currently available`);
    }

    return products;
  }

  async getProductById(ID: string) {
    if (!ID) {
      throw new BadRequestException(
        `Invalid ID, please provide a valid product ID!`,
      );
    }

    const product = await this.productRepository.findOne({
      where: { id: ID },
      relations: ['images'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${ID} not found.`);
    }

    return product;
  }

  async createProduct(productDto: ProductDto) {
    const product: ProductDto = {
      ...productDto,
      name: productDto.name,
      price: productDto.price,
      status: productDto.status,
    };

    const createdProduct = this.productRepository.create(product);
    return await this.productRepository.save(createdProduct);
  }

  async updateProduct(ID: string, updateProductDto: UpdateProductDto) {
    if (!ID) {
      throw new BadRequestException(
        `Invalid ID, please provide a valid product ID!`,
      );
    }

    const product = await this.productRepository.findOne({ where: { id: ID } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${ID} not found.`);
    }

    product.name = updateProductDto.name || product.name;
    product.price = updateProductDto.price || product.price;
    product.status = updateProductDto.status || product.status;

    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async deleteProduct(ID: string) {
    if (!ID) {
      throw new BadRequestException(
        `Invalid ID, please provide a valid product ID!`,
      );
    }

    const product = await this.productRepository.findOne({ where: { id: ID } });

    if (!product) {
      throw new NotFoundException(`Product with id ${ID} not found.`);
    }

    await this.productRepository.delete(ID);
    return `The desired product has been successfully deleted ${ID}`;
  }
}
