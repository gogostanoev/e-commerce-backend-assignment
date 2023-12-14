import { ProductEntity } from "../product/entities/product.entity";
import { mockImage, mockImages } from "./image.mockData";

export const mockProduct : ProductEntity = {
    id: "1",
    name: "Notebook",
    price: 25,
    status: "active",
    images: mockImages
}

export const mockProducts : ProductEntity[] = [
    {
        id: "2",
        name: "Water bottle",
        price: 30,
        status: "active",
        images: mockImages
    },
    {
        id: "3",
        name: "Chipsy",
        price: 70,
        status: "active",
        images: [mockImage]
    },
    {
        id: "4",
        name: "Black olives",
        price: 250,
        status: "inactive",
        images: [mockImage]
    }
]