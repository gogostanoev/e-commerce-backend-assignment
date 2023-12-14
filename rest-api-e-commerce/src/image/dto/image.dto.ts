import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ImageDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsNumber()
    priority: number;
}

export class UpdateImageDto {
    @IsOptional()
    @IsString()
    url?: string;

    @IsOptional()
    @IsNumber()
    priority?: number
}