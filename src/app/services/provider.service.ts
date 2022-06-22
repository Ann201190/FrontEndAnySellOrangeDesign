import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { Coming } from '../models/coming';
import { Provider } from '../models/provider';


@Injectable(
    { providedIn: 'root' }
)
export class ProviderService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }


    getProvider(): Observable<Provider[]> {
        return this.http.get<Provider[]>(`${this.baseApiUrl}provider`)
    }

    getByIdProvider(id: Guid): Observable<Provider> {
        return this.http.get<Provider>(`${this.baseApiUrl}provider/${id}`)
    }

    getComingsProvider(id: Guid, storeId: Guid): Observable<Coming[]> {
        return this.http.get<Coming[]>(`${this.baseApiUrl}provider/comings/${id}/${storeId}`)
    }

    addProvider(provider: Provider): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}provider`, provider)
    }

    editProvider(provider: Provider): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}provider/updateprovider`, provider)
    }

    deleteProvider(id: Guid): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseApiUrl}provider/deleteprovider/${id}`)
    }

    /* getDiscountByIdStore(storeId: Guid): Observable<Discount[]> {
         return this.http.get<Discount[]>(`${this.baseApiUrl}discount/getstorediscount/${storeId}`)
     }
  */
}