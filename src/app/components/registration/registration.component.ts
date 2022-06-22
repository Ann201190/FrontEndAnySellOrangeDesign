import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public translateService: TranslateService,
    private toast: HotToastService,
    private storage: LocalStorageService,
    private router: Router) { }

  form!: FormGroup;

  submitted = false;

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('')
    })
  }

  registration() {
    this.authService.registrationManager(this.form.value.email, this.form.value.password)
      .subscribe(res => {
        {
          if (this.storage.getItem('lang') == Language.en) this.toast.success('Registration successful!');
          else this.toast.success('Регистрация успешна!');
        }
        this.router.navigate([`information`]);
      }, error => {
        if (this.storage.getItem('lang') == Language.en) this.toast.error('Registration failed! Check your email or password.');
        else this.toast.error('Регистрация неуспешна! Проверьте свою почту или пароль.');
      })
  }
}
