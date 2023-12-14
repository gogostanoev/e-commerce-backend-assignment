import { ImageInterface } from "./image.interface";

export interface ProductInterface {
    id: string;
    name: string;
    price: number;
    status: string;
    images: ImageInterface[]
}