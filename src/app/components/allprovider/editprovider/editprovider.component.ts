import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { Provider } from 'src/app/models/provider';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-editprovider',
  templateUrl: './editprovider.component.html',
  styleUrls: ['./editprovider.component.css']
})
export class EditproviderComponent implements OnInit {

  public mask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  form!: FormGroup;
  public isWaiting = false;  //ожидание
  public provider!: Provider;

  constructor(
    private providerService: ProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))

    /* this.form = new FormGroup({
       name: new FormControl(),
       email: new FormControl(),
       phone: new FormControl(),
       other: new FormControl()
     })*/

    this.route.params.subscribe((params: Params) => {
      let id = params["id"];
      this.providerService.getByIdProvider(id).subscribe(oneProvider => {
        this.provider = oneProvider;

        this.form = new FormGroup({
          name: new FormControl(this.provider.name, [Validators.required]),
          email: new FormControl(this.provider.email, [Validators.email]),
          phone: new FormControl(this.provider.phone, [Validators.required]),
          other: new FormControl(this.provider.other,)
        });
      });
    });
  }

  editProvider() {
    if (this.provider) {
      this.provider.name = this.form.value.name,
        this.provider.email = this.form.value.email,
        this.provider.phone = "+38" + this.form.value.phone,
        this.provider.other = this.form.value.other
    }

    this.providerService.editProvider(this.provider).subscribe(prov => {

      if (prov) {
        this.successMessage();
      }
      else {
        this.errorMessage();
      }
    },
      err => {
        this.errorMessage();
      })
  }


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Provider edited successfully!');
    else this.toast.success('Поставщик отредактирован успешно!');
    this.router.navigate([`provider`]);

  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Provider not edited! Try again.');
    else this.toast.error('Поставщик не отредактирован! Попробуйте еще.');
  }

}
