import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Employee } from 'src/app/models/employee';
import { Language } from 'src/app/models/enum/language';
import { Role } from 'src/app/models/enum/role';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-listemployee',
  templateUrl: './listemployee.component.html',
  styleUrls: ['./listemployee.component.css']
})
export class ListemployeeComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public employees: Employee[] = [];
  public idEmployeeForDeleted!: Guid;
  public oneEmployee!: Employee;
  public p: any = 0;
  roleType: Array<string> = Object.keys(Role).filter(key => isNaN(+key))


  constructor(
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private employeeService: EmployeeService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.employeeService.getByStore(this.storage.getItem('storeId'))
      .subscribe(empl => {
        this.employees = empl

        let objectURL: string;

        for (let i = 0; i < empl.length; i++) {
          if (empl[i].photo != null) {

            objectURL = 'data:image/jpeg;base64,' + empl[i].photo;

            this.employees[i].photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        }
        this.oneEmployee = this.employees[0];
        this.isWaiting = false;  //ожидание
      })
  }

  updateEmployee(id: Guid | undefined) {
    this.router.navigate([`editdemployee/${id}`]);
  }

  moreEmployee(employee: Employee) {
    this.oneEmployee = employee;
  }

  idEmployee(id: Guid | undefined) {
    if (id != null) {
      this.isWaiting = true;  //ожидание
      this.employeeService.deleteEmployee(id)
        .subscribe(disc => {
          if (disc) {
            this.successMessage();
          }
          else {
            this.errorMessage();
          }
          this.isWaiting = false
        }, err => {
          this.employeeService.getByIdEmployee(id)
          this.errorMessage();
          this.isWaiting = false
        });
    };
  }

  deleteEmployee(employee: Employee) {
    if (employee.id != null) {
      this.idEmployeeForDeleted = employee.id;
    }
    this.oneEmployee = employee;
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Employee removeed successfully!');
    else this.toast.success('Сотрудник удален успешно!');

    this.allList();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Employee not removeed! Try again.');
    else this.toast.error('Сотрудник не удален! Попробуйте еще.');
  }

}
