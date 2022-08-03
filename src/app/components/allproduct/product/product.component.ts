import { Component, Inject, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { STORE_API_URL } from 'src/app/app-injection-tokens';
import { Language } from 'src/app/models/enum/language';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PrintService } from 'src/app/services/print.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  private baseApiUrl = `${this.apiUrl}api/`
  public isWaiting = false;  //ожидание
  public path: string = `${this.baseApiUrl}/product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`

  constructor(
    @Inject(STORE_API_URL) private apiUrl: string,
    public storage: LocalStorageService,
    private printService: PrintService,
    private toast: HotToastService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
  }


  download() {
    this.path = `${this.baseApiUrl}product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Price tags printed successfully!');
    else this.toast.success('Ценники распечатан успешно!');
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Price tags not printed! Try again.');
    else this.toast.error('Ценники не распечатаны! Попробуйте еще.');
  }

  printAllPriceHolder() {
    this.isWaiting = true;

    this.printService.printAllPriceHolder(this.storage.getItem('storeId')).subscribe(date => {
      if (date) {
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
