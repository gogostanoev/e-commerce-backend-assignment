import { Module } from '@nestjs/common';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product/entities/product.entity';
import { ImageEntity } from './image/entities/image.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      entities: [ProductEntity, ImageEntity]
    }),
    ProductModule,
    ImageModule,
  ],
})
export class AppModule {}
