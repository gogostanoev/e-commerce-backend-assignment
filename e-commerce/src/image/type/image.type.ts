import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ProductType } from "src/product/type/product.type";

@ObjectType("Image")
export class ImageType {
    @Field(() => ID)
    id: string;

    @Field()
    url: string;

    @Field()
    priority: number;

    @Field(() => ProductType!)
    product: ProductType
}