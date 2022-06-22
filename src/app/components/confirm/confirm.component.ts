import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  public isRegistration: boolean = false;
  public isWaiting = true;

  constructor(
    public translateService: TranslateService,
    private authService: AuthService,
    private storage: LocalStorageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))


    this.route.params.subscribe((params: Params) => {
      let stringConfirm: string = params['stringConfirm']

      this.authService.confirm(stringConfirm).subscribe(value => {
        this.isRegistration = value;

        this.isWaiting = false;
      })
    })
  }

}
