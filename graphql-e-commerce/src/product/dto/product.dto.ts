import { Field, InputType } from "@nestjs/graphql";
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class CreateProductInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Field()
    @IsNotEmpty()
    @IsString()
    @IsIn(["active", "inactive"])
    status: string;
}

@InputType()
export class UpdateProductInput {
    @Field({ nullable: true })
    @IsString()
    name?: string;

    @Field({ nullable: true })
    @IsNumber()
    price?: number;

    @Field({ nullable: true })
    @IsString()
    @IsIn(["active", "inactive"])
    status?: string;
}