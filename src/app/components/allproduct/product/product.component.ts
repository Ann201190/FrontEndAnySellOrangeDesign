import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public path: string = `https://localhost:44350/api/Product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`

  constructor(
    private producrService: ProductService,
    public storage: LocalStorageService,
    private toast: HotToastService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
  }


  download() {
    this.path = `https://localhost:44350/api/Product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
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
    
    this.producrService.printPriceHolder(this.storage.getItem('storeId')).subscribe(date => {
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
