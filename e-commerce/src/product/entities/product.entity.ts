import { ImageEntity } from "../../image/entities/image.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('product')
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column({ default: "active" })
    status: string;

    @OneToMany(() => ImageEntity, (imageEntity) => imageEntity.product, {
        cascade: true,
        eager: false,
        nullable: true,
        onDelete: "CASCADE"
    })
    images: ImageEntity[]
}