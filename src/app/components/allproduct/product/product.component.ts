import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public path: string = `https://localhost:44350/api/Product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  constructor(
    public storage: LocalStorageService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
  }


  download() {
    this.path = `https://localhost:44350/api/Product/downloadprice/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  }
}
