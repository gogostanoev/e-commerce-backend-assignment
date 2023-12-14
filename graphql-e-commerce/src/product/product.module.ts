import { Module } from '@nestjs/common';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    providers: [ProductResolver, ProductService]
})
export class ProductModule {}
