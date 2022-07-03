import { BaseEntity } from "./baseEntity";
import { ProductUnit } from "./enum/productunit";

export interface OrderProduct extends BaseEntity {
    name: string
    priceWithDiscount: number;
    barcode: string;
    productUnit: ProductUnit
}

