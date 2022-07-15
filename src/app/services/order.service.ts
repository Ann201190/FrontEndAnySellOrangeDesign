import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { GraphData } from '../models/graphData';
import { Order } from '../models/order';
import { OrderProduct } from '../models/OrderProduct';
import { Qrcode } from '../models/qrcode';


@Injectable(
    { providedIn: 'root' }
)
export class OrderService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }


    getProductByStoreId(storeId: Guid): Observable<OrderProduct[]> {
        return this.http.get<OrderProduct[]>(`${this.baseApiUrl}order/getcashboxproduct/${storeId}`)
    }

    getByStoreId(storeId: Guid): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.baseApiUrl}order/getstoreorder/${storeId}`)
    }

    getChecCashier(storeId: Guid): Observable<GraphData> {
        return this.http.get<GraphData>(`${this.baseApiUrl}order/getcheccashier/${storeId}`)
    }

    addOrder(order: any): Observable<Qrcode> {
        return this.http.post<Qrcode>(`${this.baseApiUrl}order`, order)
    }

    /*   editComing(coming: Coming): Observable<boolean> {
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