import { ImageEntity } from "../image/entities/image.entity";
import { ProductEntity } from "../product/entities/product.entity";

export const mockImage: ImageEntity = {
    id: "1",
    url: "https://notebook/image.jpg",
    priority: 1000,
    product: {
        id: "1",
        name: "Notebook",
        price: 25,
        status: "active",
        images: []
    } as ProductEntity
}

export const mockImages: ImageEntity[] = [
    {
        id: "2",
        url: "https://water-bottle/image.jpg",
        priority: 1000,
        product: {
            id: "2",
            name: "Water bottle",
            price: 30,
            status: "active",
            images: []
        } as ProductEntity
    },
    {
        id: "3",
        url: "https://chipsy/image.jpg",
        priority: 1000,
        product: {
            id: "3",
            name: "Chipsy",
            price: 70,
            status: "active",
            images: []
        } as ProductEntity
    },
    {
        id: "4",
        url: "https://black-olives/image.jpg",
        priority: 1000,
        product: {
            id: "4",
            name: "Black olives",
            price: 250,
            status: "inactive",
            images: []
        } as ProductEntity
    }
]