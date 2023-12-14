import { Field, ID, ObjectType } from "@nestjs/graphql";
import { ImageType } from "src/image/type/image.type";

@ObjectType("Product")
export class ProductType {
    @Field(() => ID)
    id: string;
    
    @Field()
    name: string;

    @Field()
    price: number;

    @Field()
    status: string;

    @Field(() => [ImageType], { nullable: 'itemsAndList' } )
    images: ImageType[]
}