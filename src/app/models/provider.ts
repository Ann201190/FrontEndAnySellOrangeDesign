import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";

export interface Provider extends BaseEntity {
    name: string;
    email: string;
    employeeId?: Guid;
    phone: string;
    other: string;
}



