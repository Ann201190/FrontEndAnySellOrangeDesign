import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { Coming } from '../models/coming';


@Injectable(
    { providedIn: 'root' }
)
export class ComingService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }


    getComingByIdStore(storeId: Guid): Observable<Coming[]> {
        return this.http.get<Coming[]>(`${this.baseApiUrl}coming/getstorecoming/${storeId}`)
    }

    addComing(coming: Coming): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}coming`, coming)
    }

    editComing(coming: Coming): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}coming/updatecoming`, coming)
    }
    /* getByIdDiscount(id: Guid): Observable<Discount> {
         return this.http.get<Discount>(`${this.baseApiUrl}discount/${id}`)
     }
 
     addDiscount(discount: Discount): Observable<boolean> {
         return this.http.post<boolean>(`${this.baseApiUrl}discount`, discount)
     }
 
   
 
     deleteDiscount(id: Guid): Observable<boolean> {
         return this.http.get<boolean>(`${this.baseApiUrl}discount/deletediscount/${id}`)
     }*/
}