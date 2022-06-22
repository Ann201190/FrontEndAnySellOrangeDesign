import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/enum/role';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isStoreId: boolean = false;
  public path: any;
  public role: any;

  roleType: Array<string> = Object.keys(Role).filter(key => isNaN(+key))

  constructor(
    private authService: AuthService,
    public storage: LocalStorageService,
    public translateService: TranslateService) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))
    this.role = this.storage.getItem('role');
    this.path = this.storage.getItem('logoImage');

    if (this.storage.getItem('storeId') != "") {
      this.isStoreId = true;
    }
  }

  public get isLoggedIn(): boolean {
    return this.authService.isAuthenticated()
  }

  logout() {
    this.authService.logout();
  }

}
