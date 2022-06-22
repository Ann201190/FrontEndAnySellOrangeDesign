import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { Store } from 'src/app/models/store';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-editstore',
  templateUrl: './editstore.component.html',
  styleUrls: ['./editstore.component.css']
})
export class EditstoreComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public store!: Store;
  @ViewChild('file', { static: false })
  InputVar!: ElementRef;
  public isWaiting = false;  //ожидание

  constructor(
    private storeService: StoreService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }


  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))

    /*  this.form = new FormGroup({
        name: new FormControl(),
        file: new FormControl()
      })*/

    this.isWaiting = true;  //ожидание
    this.route.params.subscribe((params: Params) => {
      let id = params["id"];
      this.storeService.getStoreById(id).subscribe(oneStore => {
        this.store = oneStore;

        console.log(this.store);
        if (oneStore.logoImage != null) {
          let objectURL = 'data:image/jpeg;base64,' + oneStore.logoImage;
          this.store.logoImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }


        this.form = new FormGroup({
          name: new FormControl(this.store.name, [Validators.required]),
          file: new FormControl(this.store.logoImage),
        });

        this.isWaiting = false;
      });
    });
  }

  deleteImg() {
    this.files = null;
    this.store.logoImage = undefined;
    this.InputVar.nativeElement.value = "";

    if (this.storage.getItem('lang') == Language.en) this.toast.success('Logo removed!');
    else this.toast.success('Логотип удален!');
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Store information has been successfully changed!');
    else this.toast.success('Информация о магазине успешно изменена!');

    this.router.navigate([`store`]);
  }

  successMessageWithoutImg() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Store information has been successfully changed, the logo has not been changed!!');
    else this.toast.success('Информация о магазине успешно изменена, логотип не изменен!');

    this.router.navigate([`store`]);
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Changes have not been made. Try again!');
    else this.toast.error('Изменения не внесены. Пробутйте еще раз!');
  }

  onFileChanged(event: any) {
    this.files = event.target.files[0]
    this.store.logoImage = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

  editStore() {
    this.isWaiting = true;

    if (this.store) {
      this.store.name = this.form.value.name
    }

    this.storeService.editStoreWithoutImge(this.store).subscribe(id => {

      if (id != null) {

        if (!this.files && this.store.logoImage == null) {

          this.storeService.deleteImage(id).subscribe(() => {
            this.successMessageWithoutImg();
          })

        }
        else {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.storeService.addStoretImage(formData, id).subscribe(() => {

            this.successMessage();
          })
        }
      }
      else {
        this.errorMessage();
      }
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    });
  }

}


