import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Product } from "./product";

export interface BalanceProduct extends BaseEntity {
    comingPrice: number;
    productId: Guid;
    count: number;
    product?: Product
}

