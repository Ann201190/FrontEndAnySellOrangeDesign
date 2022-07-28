import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { GraphBarData } from '../models/graphBarData';
import { GraphLineData } from '../models/grapLineData';
import { Order } from '../models/order';
import { OrderProduct } from '../models/OrderProduct';
import { ProductsReturn } from '../models/productsReturn';
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

    getCheckCashier(storeId: Guid): Observable<GraphBarData> {
        return this.http.get<GraphBarData>(`${this.baseApiUrl}order/getcheccashier/${storeId}`)
    }

    addOrder(order: any): Observable<Qrcode> {
        return this.http.post<Qrcode>(`${this.baseApiUrl}order`, order)
    }

    getProfit(storeId: Guid): Observable<GraphLineData> {
        return this.http.get<GraphLineData>(`${this.baseApiUrl}order/getprofit/${storeId}`)
    }

    getCheck(storeId: Guid, number: string): Observable<Order> {
        return this.http.get<Order>(`${this.baseApiUrl}order/getstorecheck/${storeId}/${number}`);
    }

   productsMonthe(storeId: Guid): Observable<GraphBarData> {
        return this.http.get<GraphBarData>(`${this.baseApiUrl}order/gettopthreeproduct/${storeId}`)
    }

    return(productsReturn: ProductsReturn): Observable<Qrcode> {
        return this.http.post<Qrcode>(`${this.baseApiUrl}order/productsreturn/`, productsReturn)
    }
}