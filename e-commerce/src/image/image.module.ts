import { Module } from '@nestjs/common';
import { ImageResolver } from './image.resolver';
import { ImageService } from './image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { ProductEntity } from 'src/product/entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ImageEntity, ProductEntity])],
    providers: [ImageResolver, ImageService]
})
export class ImageModule {}
