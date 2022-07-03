import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService,
    public storage: LocalStorageService,
    public translateService: TranslateService) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
  }



  public get isLoggedIn(): boolean {
    return this.authService.isAuthenticated()
  }

  logout() {
    this.authService.logout();
  }


  changeSiteLanguage(localeCode: string) {
    this.translateService.use(localeCode);
    this.setLang(localeCode)
  }

  setLang(localeCode: any) {
    this.storage.setItem('lang', localeCode);
  }

  getLang() {
    return this.storage.getItem('lang');
  }

}
