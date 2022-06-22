import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { STORE_API_URL } from '../app-injection-tokens';
import { Employee } from '../models/employee';


@Injectable(
  { providedIn: 'root' }
)
export class EmployeeService {

  private baseApiUrl = `${this.apiUrl}api/`;

  constructor(
    private http: HttpClient,
    @Inject(STORE_API_URL) private apiUrl: string) { }


  getEmployee(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}employee`)
  }

  getByStoreAsync(storeId: Guid): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseApiUrl}employee/getemployeestore/${storeId}`)
  }

  getByIdEmployee(id: Guid): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseApiUrl}employee/${id}`)
  }

  addEmployee(employee: any, storeId: Guid): Observable<Guid> {
    return this.http.post<Guid>(`${this.baseApiUrl}employee/addemployeewithoutphoto/${storeId}`, employee)
  }

  addEmployeePhoto(photo: FormData, id: Guid): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseApiUrl}employee/addemployeephoto/${id}`, photo)
  }

  editEmployee(employee: Employee): Observable<Guid> {
    return this.http.post<Guid>(`${this.baseApiUrl}employee/updateemploeewithoutphoto`, employee)
  }

  deleteEmployee(id: Guid): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}employee/deleteemployee/${id}`)
  }

  deleteImage(id: Guid): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseApiUrl}employee/deleteimage/${id}`)
  }
}


