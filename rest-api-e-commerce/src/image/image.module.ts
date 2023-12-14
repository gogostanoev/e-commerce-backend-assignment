import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { ImageService } from './image.service';
import { ProductService } from 'src/product/product.service';
import { ProductController } from 'src/product/product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity, ProductEntity])],
  providers: [ImageService, ProductService],
  controllers: [ImageController, ProductController]
})
export class ImageModule {}
