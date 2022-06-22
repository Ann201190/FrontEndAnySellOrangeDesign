import { SafeResourceUrl } from "@angular/platform-browser";
import { BaseEntity } from "./baseEntity";
import { Role } from "./enum/role";
import { Store } from "./store";

export interface Employee extends BaseEntity {
    name: string;
    surName: string;
    email: string;
    role: Role;
    photo?: SafeResourceUrl
    address: string;
    phone: string;
    other?: string;
    // store: Store;
}

