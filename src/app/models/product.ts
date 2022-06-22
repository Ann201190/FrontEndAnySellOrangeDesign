import { SafeResourceUrl } from "@angular/platform-browser";
import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Discount } from "./discount";
import { ProductUnit } from "./enum/productunit";

export interface Product extends BaseEntity {
    name: string;
    price: number;
    barcode: string;
    storeId: Guid;
    discountId?: Guid;
    productUnit: ProductUnit;
    image?: SafeResourceUrl;
    discount?: Discount;
}







