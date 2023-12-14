import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    @IsIn(["active", "inactive"])
    status: string;
}

export class UpdateProductDto {
    @IsString()
    name?: string;

    @IsNumber()
    price?: number;

    @IsString()
    @IsIn(["active", "inactive"])
    status?: string;
}