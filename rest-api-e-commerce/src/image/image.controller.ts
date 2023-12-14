import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { IdRouteParams } from '../interfaces/route.interface';
import { ImageDto, UpdateImageDto } from './dto/image.dto';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getImages() {
    const images = this.imageService.getImages();

    return images;
  }

  @Get(':id')
  getImageById(@Param() params: IdRouteParams) {
    return this.imageService.getImageById(params.id);
  }

  @Post(':productId')
  createImage(@Body() body: ImageDto, @Param() params: IdRouteParams) {
    return this.imageService.createImage(body, params.id);
  }

  @Put(':id')
  updateImage(@Param() params: IdRouteParams, @Body() body: UpdateImageDto) {
    return this.imageService.updateImage(params.id, body);
  }

  @Delete(':id?')
  deleteImage(@Param() params: IdRouteParams) {
    return this.imageService.deleteImage(params.id);
  }
}
