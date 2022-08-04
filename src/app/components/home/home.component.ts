import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Employee } from 'src/app/models/employee';
import { Language } from 'src/app/models/enum/language';
import { Role } from 'src/app/models/enum/role';
import { Store } from 'src/app/models/store';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

export const ACCESS_TOKEN_KEY = 'backendanysell_access_token'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  form!: FormGroup;
  public isWaiting = false;  //ожидание
  public store!: Store;  //ожидание
  public employees: Employee[] = [];
  public employee!: Employee
  public countEmployees!: number

  constructor(
    private authService: AuthService,
    public translateService: TranslateService,
    public storeService: StoreService,
    public employeeService: EmployeeService,
    private toast: HotToastService,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    private router: Router) {
  }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })

    this.isWaiting = true;
    if (this.storage.getItem('storeId') != "") {
      this.storeService.getStoreById(this.storage.getItem('storeId')).subscribe(res => {
        this.store = res
        let objectURL = 'data:image/jpeg;base64,' + this.store.logoImage;
        this.store.logoImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);


        this.employeeService.getByStore(this.storage.getItem('storeId')).subscribe(res => {
          this.employees = res

          this.employees.forEach(element => {
            if (element.role == Role.Manager)
              this.employee = element;
          });
          this.countEmployees =  this.employees.length

          this.isWaiting = false;
        })
      })

    }
  }

  public get isLoggedIn(): boolean {
    //return false;
    return this.authService.isAuthenticated()
  }

  login() {
    this.isWaiting = true;
    this.authService.login(this.form.value.email, this.form.value.password)
      .subscribe(res => {
        {
          if (this.storage.getItem('lang') == Language.en) this.toast.success('Login successful!');
          else this.toast.success('Вход в систему успешный!');
        }
        this.storage.setItem('email', this.form.value.email);
        this.isWaiting = false;
        this.router.navigate(['store']);

        let token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (token != null) {
          const token_parts = token.split(/\./);


          this.storage.setItem('role', JSON.parse(window.atob(token_parts[1])).role);
        }

      }, error => {
        if (this.storage.getItem('lang') == Language.en) this.toast.error('Login failed! Check your email or password.');
        else this.toast.error('Вход в систему неуспешный! Проверьте свою почту или пароль.');
        this.isWaiting = false;
      })
  }

  logout() {
    this.authService.logout();
  }
}
