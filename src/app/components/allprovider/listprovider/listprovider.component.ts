import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Coming } from 'src/app/models/coming';
import { Language } from 'src/app/models/enum/language';
import { Provider } from 'src/app/models/provider';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-listprovider',
  templateUrl: './listprovider.component.html',
  styleUrls: ['./listprovider.component.css']
})
export class ListproviderComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public providers: Provider[] = [];
  public idProviderForDeleted!: Guid;
  public oneProvider!: Provider;
  public comingsProvider: Coming[] = [];

  constructor(
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private providerService: ProviderService,
    private router: Router,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.providerService.getProvider()
      .subscribe(prov => {
        this.providers = prov
        this.oneProvider = this.providers[0];
        this.isWaiting = false;  //ожидание
      })
  }

  updateProvider(id: Guid | undefined) {
    this.router.navigate([`editdprovider/${id}`]);
  }


  deleteProvider(provider: Provider) {
    if (provider.id != null) {
      this.idProviderForDeleted = provider.id;
    }
    this.oneProvider = provider;
  }

  moreProvider(provider: Provider) {

    if (provider.id != null) {
      this.providerService.getComingsProvider(provider.id, this.storage.getItem('storeId'))
        .subscribe(comprov => {
          this.comingsProvider = comprov

          this.oneProvider = provider;


          this.isWaiting = false;  //ожидание
        })
    }
  }

  public summCalculate(coming: Coming): Number {
    let summ = 0;
    coming.balanceProducts.forEach(bp => {
      summ += (bp.comingPrice * bp.count);
    });
    return summ;
  }


  idProvider(id: Guid | undefined) {
    if (id != null) {
      this.isWaiting = true;  //ожидание
      this.providerService.deleteProvider(id).subscribe(() => {

        if (this.storage.getItem('lang') == Language.en) this.toast.success('Provider delete successfully!');
        else this.toast.success('Поставщик удален успешно!');
        this.isWaiting = false;
        this.allList();
      });
    }
    else {
      if (this.storage.getItem('lang') == Language.en) this.toast.error('Provider not delete! Try again.');
      else this.toast.error('Поставщик не удален! Попробуйте еще.');
      this.isWaiting = false;
    }
  }
}
