import { Module } from '@nestjs/common';
import { AppService } from './app.service';

import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'water123',
      database: 'rest-api-e-commerce',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductModule,
    ImageModule,
  ],
  providers: [AppService],
})
export class AppModule {}
