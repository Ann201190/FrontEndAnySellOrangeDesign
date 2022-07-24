import { SafeResourceUrl } from "@angular/platform-browser";
import { BaseEntity } from "./baseEntity";
import { Role } from "./enum/role";


export interface Employee extends BaseEntity {
    name: string;
    surName: string;
    email: string;
    role: Role;
    photo?: SafeResourceUrl
    address: string;
    phone: string;
    other?: string;
    printerName: string;
    printerDpi: number;
    // store: Store;

}

