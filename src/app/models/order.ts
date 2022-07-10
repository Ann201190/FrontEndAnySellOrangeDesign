import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { OrderStatus } from "./enum/orderstatus";
import { ReservationProduct } from "./reservationProduct";


export interface Order extends BaseEntity {
    idStore: Guid;
    orderNumber?: string
    orderStatus?: OrderStatus
    orderDate?: Date
    reservationProducts: ReservationProduct[]
}

