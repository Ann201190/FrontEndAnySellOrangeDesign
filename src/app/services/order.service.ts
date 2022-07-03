import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { OrderProduct } from '../models/OrderProduct';


@Injectable(
    { providedIn: 'root' }
)
export class OrderService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }


    getOrderByIdStore(storeId: Guid): Observable<OrderProduct[]> {
        return this.http.get<OrderProduct[]>(`${this.baseApiUrl}order/getcashboxproduct/${storeId}`)
    }

    /* 
     addComing(coming: Coming): Observable<boolean> {
         return this.http.post<boolean>(`${this.baseApiUrl}coming`, coming)
     }
 
   editComing(coming: Coming): Observable<boolean> {
           return this.http.post<boolean>(`${this.baseApiUrl}coming/updatecoming`, coming)
       }*/
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