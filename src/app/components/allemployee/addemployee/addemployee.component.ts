import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public isWaiting = false;  //ожидание
  public image: any = null;
  public mask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  @ViewChild('file', { static: false })
  InputVar!: ElementRef;

  constructor(
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }


  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //для добавления cотрудника
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      surname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      other: new FormControl(''),
      file: new FormControl('')
    })
  }



  deleteImg() {
    this.files = null;
    this.image = null;
    this.InputVar.nativeElement.value = "";

    if (this.storage.getItem('lang') == Language.en) this.toast.success('Photo removed!');
    else this.toast.success('Фото удалено!');
  }


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Employee added successfully!');
    else this.toast.success('Сотрудник добавлен успешно!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Employee not added! Try again.');
    else this.toast.error('Сотрудник не добавлен! Попробуйте еще.');
    this.form.reset(); //очищение формы
    window.location.reload();
  }

  successMessageWithoutPhoto() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Employee added successfully, but no photo!');
    else this.toast.success('Сотрудник добавлен успешно, но без фото!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  addEmployee() {

    this.isWaiting = true;

    var employee: any = {
      name: this.form.value.name,
      surname: this.form.value.surname,
      email: this.form.value.email,
      other: this.form.value.other,
      phone: "+38" + this.form.value.phone,
      address: this.form.value.address
    }

    this.employeeService.addEmployee(employee, this.storage.getItem('storeId')).subscribe(id => {

      this.isWaiting = true;
      if (id != null) {
        if (this.files) {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.employeeService.addEmployeePhoto(formData, id).subscribe(() => {

            this.authService.registrationCashier(this.form.value.email).subscribe(registr => {
              if (registr) {
                this.successMessage();
              }
              else {
                this.errorMessage();
              }
            })
          })
        }
        else {
          this.successMessageWithoutPhoto();
        }
      }
      else {
        this.errorMessage();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    })
  }

  //загрузка файла
  onFileChanged(event: any) {
    this.files = event.target.files[0];
    this.image = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

}


