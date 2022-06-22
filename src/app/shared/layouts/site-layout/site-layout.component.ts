import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

  @ViewChild('floating') floatingRef!: ElementRef

  constructor(
    public translateService: TranslateService,
    private storage: LocalStorageService) { }

  ngOnInit(): void {
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
