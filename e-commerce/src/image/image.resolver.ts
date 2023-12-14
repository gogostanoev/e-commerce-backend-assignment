import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ImageType } from "./type/image.type";
import { ImageService } from "./image.service";
import { ProductType } from "src/product/type/product.type";
import { ImageEntity } from "./entities/image.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { CreateImageInput, UpdateImageInput } from "./dto/image.dto";

@Resolver(() => ImageType)
export class ImageResolver {
    constructor(private readonly imageService: ImageService) {}

    @Query(() => [ImageType])
    images() {
        return this.imageService.getImages()
    }

    @Query(() => ImageType)
    image(@Args("id", { type: () => ID }) id: string) {
        return this.imageService.getImageById(id)
    }

    @Mutation(() => ImageType)
    createImage(
        @Args("image") image: CreateImageInput,
        @Args("productId", { type: () => ID }) productId: string
    ) {
        return this.imageService.createImage(image, productId)
    }

    @Mutation(() => ImageType)
    updateImage(
        @Args("id", { type: () => ID }) id: string,
        @Args("image") image: UpdateImageInput
    ) {
        return this.imageService.updateImage(id, image)
    }

    @Mutation(() => String)
    deleteImage(@Args("id", { type: () => ID }) id: string) {
        return this.imageService.deleteImage(id)
    }

    @ResolveField("product", () => ProductType)
    async product(@Parent() image: ImageEntity): Promise<ProductEntity> {
        return this.imageService.getProductFromImages(image.id)
    }
} 