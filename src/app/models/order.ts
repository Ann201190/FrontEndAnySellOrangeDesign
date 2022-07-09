import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { ReservationProduct } from "./reservationProduct";


export interface Order extends BaseEntity {
    idStore: Guid;
    reservationProduct: ReservationProduct[]
}

