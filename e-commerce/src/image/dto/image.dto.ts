import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@InputType()
export class CreateImageInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    url: string;

    @Field()
    @IsNotEmpty()
    @IsNumber()
    priority: number;
}

@InputType()
export class UpdateImageInput {
    @Field({ nullable: true })
    @IsString()
    url?: string;

    @Field({ nullable: true })
    @IsNumber()
    priority?: number
}