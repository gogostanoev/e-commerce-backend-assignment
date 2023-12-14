import { ProductInterface } from "./product.interface";

export interface ImageInterface {
    id: string;
    url: string;
    priority: number;
    product: ProductInterface
}