import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Employee } from 'src/app/models/employee';
import { Language } from 'src/app/models/enum/language';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css']
})
export class EditemployeeComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public isWaiting = false;  //ожидание
  public employee!: Employee;
  public mask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  @ViewChild('file', { static: false })
  InputVar!: ElementRef;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    public storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService,
    private sanitizer: DomSanitizer,) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    /* this.form = new FormGroup({
       name: new FormControl(),
       email: new FormControl(),
       surname: new FormControl(),
       phone: new FormControl(),
       address: new FormControl(),
       other: new FormControl(),
       file: new FormControl()
     })*/

    this.isWaiting = true;
    this.route.params.subscribe((params: Params) => {
      let id = params["id"];
      this.employeeService.getByIdEmployee(id).subscribe(oneEmployee => {
        this.employee = oneEmployee;


        if (oneEmployee.photo != null) {
          let objectURL = 'data:image/jpeg;base64,' + oneEmployee.photo;
          this.employee.photo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }

        this.form = new FormGroup({
          name: new FormControl(this.employee.name, [Validators.required]),
          email: new FormControl(this.employee.email),
          other: new FormControl(this.employee.other),
          surname: new FormControl(this.employee.surName, [Validators.required]),
          phone: new FormControl(this.employee.phone, [Validators.required]),
          address: new FormControl(this.employee.address, [Validators.required]),
          file: new FormControl('')
        });


        this.isWaiting = false;
      });
    });
  }

  onFileChanged(event: any) {
    this.files = event.target.files[0]
    this.employee.photo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

  deleteImg() {
    this.files = null;
    this.employee.photo = undefined;
    this.InputVar.nativeElement.value = "";

    if (this.storage.getItem('lang') == Language.en) this.toast.success('Photo removed!');
    else this.toast.success('Фото удалено!');
  }

  editEmployee() {

    if (this.employee) {
      this.employee.name = this.form.value.name,
        this.employee.surName = this.form.value.surname,
        this.employee.other = this.form.value.other,
        this.employee.address = this.form.value.address,
        this.employee.phone = "+38" + this.form.value.phone
    }
    this.isWaiting = true;
    this.employeeService.editEmployee(this.employee).subscribe(id => {

      if (id != null) {
        if (!this.files && this.employee.photo == null) {

          this.employeeService.deleteImage(id).subscribe(() => {
            this.successMessageWithoutPhoto();
          })
        }
        else {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.employeeService.addEmployeePhoto(formData, id).subscribe(() => {
            this.successMessage();
          })

        }
      }
      else {
        this.errorMessage();
      }
      this.isWaiting = false;
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    });

  }

  successMessageWithoutPhoto() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Employee added successfully, but no photo!');
    else this.toast.success('Сотрудник отредактирован успешно, но без фото!');

    this.router.navigate([`employee`]);
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Employee edited successfully!');
    else this.toast.success('Сотрудник отредактирован успешно!');
    this.router.navigate([`employee`]);
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Employee not edited! Try again.');
    else this.toast.error('Сотрудник не отредактирован! Попробуйте еще.');
  }
}
