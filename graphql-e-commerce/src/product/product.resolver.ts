import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ProductType } from "./type/product.type";
import { ProductService } from "./product.service";
import { ImageType } from "src/image/type/image.type";
import { ProductEntity } from "./entities/product.entity";
import { ImageEntity } from "src/image/entities/image.entity";
import { CreateProductInput, UpdateProductInput } from "./dto/product.dto";

@Resolver(() => ProductType)
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    @Query(() => [ProductType])
    products() {
        return this.productService.getProducts()
    }

    @Query(() => ProductType)
    product(@Args("id", { type: () => ID }) id: string) {
        return this.productService.getProductById(id)
    }

    @Mutation(() => ProductType)
    createProduct(@Args("product") product: CreateProductInput ) {
        return this.productService.createProduct(product)
    }

    @Mutation(() => ProductType)
    updateProduct(
        @Args("id", { type: () => ID }) id: string,
        @Args("product") product: UpdateProductInput
    ) {
        return this.productService.updateProduct(id, product)
    }

    @Mutation(() => String)
    deleteProduct(@Args("id", { type: () => ID }) id: string) {
        return this.productService.deleteProduct(id)
    }

    @ResolveField("images", () => [ImageType])
    async images(@Parent() product: ProductEntity): Promise<ImageEntity[]> {
        return this.productService.getImagesFromProduct(product.id)
    }
}