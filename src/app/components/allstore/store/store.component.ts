import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/enum/role';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

export const ACCESS_TOKEN_KEY = 'backendanysell_access_token'

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {

  public isVisible: boolean = false;
  public isWaiting: boolean = false;


  constructor(
    private storeService: StoreService,
    private router: Router,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    public employeeService: EmployeeService
  ) { }


  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))
    this.isWaiting = true;
    // this.storage.removeItem('storeId');

    /* let token = localStorage.getItem(ACCESS_TOKEN_KEY);
 
     if (token != null) {
       const token_parts = token.split(/\./);
      // this.role = JSON.parse(window.atob(token_parts[1])).email;
      this.role = JSON.parse(window.atob(token_parts[1])).role;
       //   this.emailUser = token_decoded.email
       console.log(this.role)
     }*/


    this.employeeService.getEmployee().subscribe(isExistEmployee => {

      if (!isExistEmployee) {
        this.storeService.getStore().subscribe(stores => {

          if (stores.length == 0 && this.storage.getItem('role') != Role[0]) {
            this.isVisible = true;
            this.isWaiting = false;
          }
          else {
            this.router.navigate(['informationcashier']);
          }
        }
        )
      }
      this.isWaiting = false;
    })
  }
}


