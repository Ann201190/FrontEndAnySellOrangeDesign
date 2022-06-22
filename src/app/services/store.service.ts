import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { IdForStore } from '../models/idForStore';
import { Store } from '../models/store';

@Injectable(
  { providedIn: 'root' }
)
export class StoreService {


  setIdCurentStore(id: string) {
    localStorage.setItem('idStore', id);
  }

  getIdCurentStore() {
    return localStorage.getItem('idStore')
  }

  private baseApiUrl = `${this.apiUrl}api/`;

  constructor(
    private http: HttpClient,
    @Inject(STORE_API_URL) private apiUrl: string) { }


  getStore(): Observable<Store[]> {
    return this.http.get<Store[]>(`${this.baseApiUrl}store`)
  }

  getStoreById(id: Guid): Observable<Store> {
    return this.http.get<Store>(`${this.baseApiUrl}store/${id}`)
  }

  addStoretWithoutImage(store: any): Observable<IdForStore> {
    return this.http.post<IdForStore>(`${this.baseApiUrl}store/addstorewithemployeewithoutimage`, store)
  }

  addStoretImage(image: FormData, id: Guid): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseApiUrl}store/addstoreimage/${id}`, image)
  }

  addStoretWithoutEmployeeWithoutImage(store: any): Observable<Guid> {
    return this.http.post<Guid>(`${this.baseApiUrl}store/addstorewithoutemployeewithoutimage`, store)
  }

  editStoreWithoutImge(store: any): Observable<Guid> {
    return this.http.post<Guid>(`${this.baseApiUrl}store/updatestorewithouteimge`, store)
  }

  deleteStore(id: Guid): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}store/deletestore/${id}`)
  }

  deleteImage(id: Guid): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}store/deleteimage/${id}`)
  }
}


