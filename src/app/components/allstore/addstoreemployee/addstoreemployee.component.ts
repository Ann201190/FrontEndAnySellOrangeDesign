import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-addstoreemployee',
  templateUrl: './addstoreemployee.component.html',
  styleUrls: ['./addstoreemployee.component.css']
})
export class AddstoreemployeeComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public fileslogo: any = 0;
  public filesphoto: any = 0;
  form!: FormGroup;
  public photo: any = null;
  public logo: any = null;
  public mask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  @ViewChild('filelogo', { static: false })
  InputVarLogo!: ElementRef;

  @ViewChild('filephoto', { static: false })
  InputVarPhoto!: ElementRef;


  constructor(
    private storeService: StoreService,
    private employeeService: EmployeeService,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }


  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //для добавления магазина
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      filelogo: new FormControl(''),
      filephoto: new FormControl(''),
      other: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required])
    })
  }

  //загрузка файла
  onFileChangedLogo(event: any) {
    this.fileslogo = event.target.files[0]
    this.logo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.fileslogo));
  }

  onFileChangedPhoto(event: any) {
    this.filesphoto = event.target.files[0]
    this.photo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.filesphoto));
  }


  deleteLogo() {
    this.fileslogo = null;
    this.logo = null;
    this.InputVarLogo.nativeElement.value = "";
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Logo removed!');
    else this.toast.success('Логотип удален!');
  }

  deletePhoto() {
    this.filesphoto = null;
    this.photo = null;
    this.InputVarPhoto.nativeElement.value = "";
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Photo removed!');
    else this.toast.success('Фото удален!');
  }



  /* successMessageWithoutImg() {
     if (this.storage.getItem('lang') == Language.en) this.toast.success('Store added successfully, but no logo!');
     else this.toast.success('Магазин добавлен успешно, но без логотипа!');
 
     this.form.reset(); //очищение формы
     window.location.reload();
   }*/


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Store added successfully!');
    else this.toast.success('Магазин добавлен успешно!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }


  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Store not added! Try again.');
    else this.toast.error('Магазин не добавлен! Попробуйте еще.');
    window.location.reload();
  }

  // рабочее добавляло картинку в папку
  addStore() {
    this.isWaiting = true;  //ожидание
    var store = {
      nameStore: this.form.value.name,
      other: this.form.value.other,
      address: this.form.value.address,
      nameEmployee: this.form.value.firstname,
      surNameEmployee: this.form.value.lastname,
      phone: "+38" + this.form.value.phone
    }

    this.storeService.addStoretWithoutImage(store).subscribe(id => {

      if (id.storeId != null) {
        if (this.fileslogo) {

          const formData = new FormData();

          formData.append(this.fileslogo.name, this.fileslogo);

          this.storeService.addStoretImage(formData, id.storeId).subscribe(() => { })
        }
        if (id.employeeId != null) {
          if (this.filesphoto) {

            const formData = new FormData();

            formData.append(this.filesphoto.name, this.filesphoto);

            this.employeeService.addEmployeePhoto(formData, id.employeeId).subscribe(() => { })
          }
        }
        this.successMessage();
      }
      else {
        this.errorMessage();
      }
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    })
  }

}
