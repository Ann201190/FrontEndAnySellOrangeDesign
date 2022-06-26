import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { Discount } from '../models/discount';


@Injectable(
    { providedIn: 'root' }
)
export class balanceProductService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }


    /*  getDiscountByIdStore(storeId: Guid): Observable<Discount[]> {
          return this.http.get<Discount[]>(`${this.baseApiUrl}discount/getstorediscount/${storeId}`)
      }
  
      getByIdDiscount(id: Guid): Observable<Discount> {
          return this.http.get<Discount>(`${this.baseApiUrl}discount/${id}`)
      }
  
      addDiscount(discount: Discount): Observable<boolean> {
          return this.http.post<boolean>(`${this.baseApiUrl}discount`, discount)
      }
  
      addProducDiscount(id: Guid, product: any): Observable<boolean> {
          return this.http.post<boolean>(`${this.baseApiUrl}discount/addproductdiscount/${id}`, product)
      }
  
      editDiscount(discount: Discount): Observable<boolean> {
          return this.http.post<boolean>(`${this.baseApiUrl}discount/updatediscount`, discount)
      }
  
      deleteDiscount(id: Guid): Observable<boolean> {
          return this.http.get<boolean>(`${this.baseApiUrl}discount/deletediscount/${id}`)
      }
  
      deleteProducDiscount(id: Guid, product: any): Observable<boolean> {
          return this.http.post<boolean>(`${this.baseApiUrl}discount/deleteproductdiscount/${id}`, product)
      }*/
}