import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { Provider } from 'src/app/models/provider';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-addprovider',
  templateUrl: './addprovider.component.html',
  styleUrls: ['./addprovider.component.css']
})
export class AddproviderComponent implements OnInit {

  form!: FormGroup;
  public isWaiting = false;  //ожидание
  public mask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(
    private providerService: ProviderService,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //для добавления cотрудника
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email]),
      phone: new FormControl('', [Validators.required]),
      other: new FormControl(''),
    })
  }


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Provider added successfully!');
    else this.toast.success('Поставщик добавлен успешно!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Provider not added! Try again.');
    else this.toast.error('Поставщик не добавлен! Попробуйте еще.');
    this.form.reset(); //очищение формы
    window.location.reload();
  }

  addProvider() {

    console.log(this.form.value.phone);

    var provider: Provider = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: "+38" + this.form.value.phone,
      other: this.form.value.other,
    }
    this.isWaiting = true;
    this.providerService.addProvider(provider).subscribe(addProv => {

      if (addProv) {
        this.successMessage();
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

}
