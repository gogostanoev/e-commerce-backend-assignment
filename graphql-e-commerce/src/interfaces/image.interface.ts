import { Product } from "./product.interface";

export interface Image {
    id: string;
    url: string;
    priority: number;
    product: Product;
}