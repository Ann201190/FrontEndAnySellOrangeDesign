
import { Guid } from "guid-typescript";
import { BalanceProduct } from "./balanceProduct";
import { BaseEntity } from "./baseEntity";
import { Provider } from "./provider";

export interface Coming extends BaseEntity {
    number: string;
    storeId: Guid;
    providerId: Guid;
    date?: Date,
    provider?: Provider,
    balanceProducts: BalanceProduct[];
}
