import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { Product } from '../models/product';
import { ProductWithDiscount } from '../models/productWithDiscount';


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseApiUrl = `${this.apiUrl}api/`;

    constructor(
        private http: HttpClient,
        @Inject(STORE_API_URL) private apiUrl: string) { }

    ngOnInit(): void {
    }

    getProductByIdStore(storeId: Guid): Observable<ProductWithDiscount[]> {
        return this.http.get<ProductWithDiscount[]>(`${this.baseApiUrl}product/getstoreproduct/${storeId}`)
    }

    getByIdProduct(id: Guid): Observable<Product> {
        return this.http.get<Product>(`${this.baseApiUrl}product/${id}`)
    }

    getProductDiscount(discountId: Guid): Observable<ProductWithDiscount[]> {
        return this.http.get<ProductWithDiscount[]>(`${this.baseApiUrl}product/discountproducts/${discountId}`)
    }

    getProductsWithoutDiscount(discountId: Guid): Observable<ProductWithDiscount[]> {
        return this.http.get<ProductWithDiscount[]>(`${this.baseApiUrl}product/productswithoutdiscount/${discountId}`)
    }

    addProductImage(image: FormData, id: Guid): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseApiUrl}product/addproductimage/${id}`, image)
    }

    addProductWithoutImage(product: Product): Observable<Guid> {
        return this.http.post<Guid>(`${this.baseApiUrl}product/addproductwithoutimage`, product)
    }

    editProductWithoutImge(product: any): Observable<Guid> {
        return this.http.post<Guid>(`${this.baseApiUrl}product/updateproductwithoutimge`, product)
    }

    deleteProduct(id: Guid): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseApiUrl}product/deleteproduct/${id}`)
    }

    deleteImage(id: Guid): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseApiUrl}product/deleteimage/${id}`)
    }

    printPriceHolder(id: Guid): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseApiUrl}print/printpriceholder/${id}`)
    }

    printAllPriceHolder(storeId: Guid): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseApiUrl}print/printallpriceholders/${storeId}`)
    }
}