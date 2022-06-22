import { Product } from "./product";

export interface ProductWithDiscount extends Product {
    priceWithDiscount: number;
    checked?: boolean;
    index?: number;
}
