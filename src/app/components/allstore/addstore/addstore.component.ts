import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-addstore',
  templateUrl: './addstore.component.html',
  styleUrls: ['./addstore.component.css']
})
export class AddstoreComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public image: any = null;
  public isWaiting = false;

  @ViewChild('file', { static: false })
  InputVar!: ElementRef;

  constructor(
    private storeService: StoreService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }


  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //для добавления магазина
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      file: new FormControl('')
    })
  }

  deleteImg() {
    this.files = null;
    this.image = null;
    this.InputVar.nativeElement.value = "";
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Logo removed!');
    else this.toast.success('Логотип удален!');
  }

  //загрузка файла
  onFileChanged(event: any) {
    this.files = event.target.files[0]
    this.image = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Store added successfully!');
    else this.toast.success('Магазин добавлен успешно!');

    this.form.reset(); //очищение формы

    this.router.navigate([`store`]);
  }

  successMessageWithoutImg() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Store added successfully, but no logo!');
    else this.toast.success('Магазин добавлен успешно, но без логотипа!');

    this.form.reset(); //очищение формы

    this.router.navigate([`store`]);
    //  window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Store not added! Try again.');
    else this.toast.error('Магазин не добавлен! Попробуйте еще.');
  }

  //  рабочее добавляло картинку в папку
  addStore() {

    var store = {
      name: this.form.value.name
    }
    this.isWaiting = true;
    this.storeService.addStoretWithoutEmployeeWithoutImage(store).subscribe(id => {

      if (id != null) {
        if (this.files) {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.storeService.addStoretImage(formData, id).subscribe(() => {

            this.successMessage();
          })
        }
        else {
          this.successMessageWithoutImg();
        }
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
