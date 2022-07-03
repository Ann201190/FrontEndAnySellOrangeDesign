import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Language } from 'src/app/models/enum/language';
import { Role } from 'src/app/models/enum/role';
import { Store } from 'src/app/models/store';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StoreService } from 'src/app/services/store.service';

export const ACCESS_TOKEN_KEY = 'backendanysell_access_token'

@Component({
  selector: 'app-liststore',
  templateUrl: './liststore.component.html',
  styleUrls: ['./liststore.component.css']
})
export class ListStoreComponent implements OnInit {

  public storesEmployee!: Store[];
  public idSelected!: string;
  public isWaiting = false;  //ожидание
  public role: any;
  public p: any = 0;
  roleType: Array<string> = Object.keys(Role).filter(key => isNaN(+key))

  constructor(
    private storeService: StoreService,
    public storage: LocalStorageService,
    private router: Router,
    private toast: HotToastService,
    public translateService: TranslateService,
    private sanitizer: DomSanitizer) { }

  thumbnail: any;

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))

    this.role = this.storage.getItem('role');
    this.allList();
  }

  allList() {
    this.isWaiting = true;
    this.storeService.getStore().subscribe(stores => {
      this.storesEmployee = stores;

      if (this.storage.getItem('storeId') != "") {
        this.idSelected = this.storage.getItem('storeId')
      }

      let objectURL: string;

      for (let i = 0; i < stores.length; i++) {
        if (stores[i].logoImage != null) {

          objectURL = 'data:image/jpeg;base64,' + stores[i].logoImage;

          this.storesEmployee[i].logoImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
      }
      this.isWaiting = false;
    })
  }

  isActiv(idStore: Guid | undefined): boolean {
    if (this.idSelected == idStore?.toString()) {
      return true;
    }
    return false;
  }

  setIdAndNameStoreAndNameIser(id: any, name: any, logoImage: any) {
    this.storage.setItem('storeId', id);
    this.idSelected = this.storage.getItem('storeId');
    this.storage.setItem('storeName', name);
    this.storage.setItem('logoImage', logoImage);

    this.router.navigate(['']);
  }

  addStore() {
    this.router.navigate(['addstore']);
  }


  editStore(id: Guid | undefined) {
    this.router.navigate([`editstore/${id?.toString()}`]);
  }


  deleteStore(id: Guid | undefined) {
    if (id) {
      this.isWaiting = true;
      this.storeService.deleteStore(id).subscribe(() => {

        if (this.storage.getItem('lang') == Language.en) this.toast.success('Store delete successfully!');
        else this.toast.success('Магазин удален успешно!');
        this.allList();
        this.router.navigate(['store'])
        this.isWaiting = false;
      });
    }
    else {
      if (this.storage.getItem('lang') == Language.en) this.toast.error('Store not delete! Try again.');
      else this.toast.error('Магазин не удален! Попробуйте еще.');
    }
  }
}



