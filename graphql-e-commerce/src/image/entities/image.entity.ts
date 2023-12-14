import { ProductEntity } from "../../product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("image")
export class ImageEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    url: string;

    @Column({ default: 1000 })
    priority: number;

    @ManyToOne(() => ProductEntity, (productEntity) => productEntity.images, {
        nullable: false,
        onDelete: "CASCADE"
    })
    product: ProductEntity
}