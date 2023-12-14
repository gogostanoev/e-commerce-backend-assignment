import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { IdRouteParams } from '../interfaces/route.interface';
import { ProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    getProducts() {
        const products = this.productService.getProducts();

        return products;
    }

    @Get(":id")
    getProductById(@Param() params: IdRouteParams) {
        return this.productService.getProductById(params.id);
    }

    @Post()
    createProduct(@Body() body: ProductDto) {
        return this.productService.createProduct(body);
    }

    @Put(":id")
    updateProduct(@Param() params: IdRouteParams, @Body() body: UpdateProductDto ) {
        return this.productService.updateProduct(params.id, body)
    }

    @Delete(":id?")
    deleteProduct(@Param() params: IdRouteParams) {
        return this.productService.deleteProduct(params.id)
    }
}
