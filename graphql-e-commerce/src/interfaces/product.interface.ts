import { Image } from "./image.interface";

export interface Product {
    id: string;
    name: string;
    price: number;
    status: string;
    images: Image[]
}