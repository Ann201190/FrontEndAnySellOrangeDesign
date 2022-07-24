import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public namePrinters: string[] = [];
  form_1!: FormGroup;
  form_2!: FormGroup;

  constructor(

    public storage: LocalStorageService,
    public translateService: TranslateService,
    private printService: PrintService,
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form_1 = new FormGroup({
      namePrinter: new FormControl(''),
      dpi: new FormControl(''),
    })

    this.form_2 = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl(''),
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })

    this.getPrinters();
  }

  getPrinters() {
    this.isWaiting = true;

    this.employeeService.getEmployeeAllInfomation().subscribe(employee => {

      this.printService.getPrinters()
        .subscribe(name => {
          this.namePrinters = name

          let printer = employee.printerName

          if (employee.printerName == null || !this.namePrinters.includes(employee.printerName))
            printer = this.namePrinters[0]

          this.form_1 = new FormGroup({
            namePrinter: new FormControl(printer),
            dpi: new FormControl(employee.printerDpi, [Validators.required, Validators.min(0), Validators.max(Number.MAX_VALUE)]),
          })

          this.isWaiting = false;
        })
    })
  }


  changePassword() {

    var password: any = {
      currentPassword: this.form_2.value.password,
      newPassword: this.form_2.value.new_password
    }

    this.isWaiting = true;

    this.authService.changePassword(password).subscribe(isChange => {

      if (isChange) {
        this.successMessageChange();
      }
      else {
        this.errorMessageChange();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessageChange();
      this.isWaiting = false;
    })
  }

  successMessageChange() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Password changed successfully!');
    else this.toast.success('Пароль изменен успешно!');

    this.form_2.reset(); //очищение формы
    //  this.router.navigate([`settings`]);
  }

  errorMessageChange() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Password not changed! Try again.');
    else this.toast.error('Пароль не изменен! Попробуйте еще.');
    // this.form.reset(); //очищение формы
    // window.location.reload();
  }



  addSettings() {

    var printerSettings: any = {
      printerName: this.form_1.value.namePrinter,
      dpi: this.form_1.value.dpi.toFixed(0)
    }

    this.isWaiting = true;

    this.printService.setPrinterSettings(printerSettings).subscribe(isPrint => {

      if (isPrint) {
        this.successMessagePrinter();
      }
      else {
        this.errorMessagePrinter();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessagePrinter();
      this.isWaiting = false;
    })
  }

  successMessagePrinter() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Settings added successfully!');
    else this.toast.success('Настройки добавлены успешно!');

    this.form_1.reset(); //очищение формы
    //  this.router.navigate([`settings`]);
  }

  errorMessagePrinter() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Settings not added! Try again.');
    else this.toast.error('Настройки не добавлены! Попробуйте еще.');
    // this.form.reset(); //очищение формы
    //  window.location.reload();
  }

}
