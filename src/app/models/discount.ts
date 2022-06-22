import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { DiscountType } from "./enum/discounttype";

export interface Discount extends BaseEntity {
    name: string;
    value: number;
    storeId: Guid;
    discountType: DiscountType;
}

