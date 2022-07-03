import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { ProductUnit } from "./enum/productunit";

export interface Order extends BaseEntity {
    idStore: Guid;
    //   reservationProduct: ReservationProduct[]
}

