import { Guid } from "guid-typescript";

export interface ProductsReturn {
    orderNumber: string;
    reservationProductIds: Guid[];
}
