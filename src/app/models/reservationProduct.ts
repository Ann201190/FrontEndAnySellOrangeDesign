import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Order } from "./order";
import { Product } from "./product";

export interface ReservationProduct extends BaseEntity {
    checked: any;
    count: number;
    price: number;
    product: Product;
    productId?: Guid;
    orderId?: Guid;
    order: Order;
    discountValue?: number;
}







