import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { map, Observable, tap } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';


@Injectable({
    providedIn: 'root'
})
export class PrintService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }

    ngOnInit(): void {
    }

    printPriceHolder(id: Guid): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}print/printpriceholder/${id}`, {})
    }

    printAllPriceHolder(storeId: Guid): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}print/printallpriceholders/${storeId}`, {})
    }

    printCheck(orderNumber: string): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}print/print/${orderNumber}`, {})
    }
}