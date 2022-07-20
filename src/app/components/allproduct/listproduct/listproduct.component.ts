import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { Product } from 'src/app/models/product';
import { ProductWithDiscount } from 'src/app/models/productWithDiscount';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PrintService } from 'src/app/services/print.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.component.html',
  styleUrls: ['./listproduct.component.css'],

})
export class ListproductComponent implements OnInit {

  products: ProductWithDiscount[] = [];
  public isWaiting = false;  //ожидание
  public idProductForDeleted!: Guid;
  public oneProduct!: ProductWithDiscount;
  public DiscountType = DiscountType;
  public index!: number;
  public p: any = 0;
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))



  constructor(
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private producrService: ProductService,
    private router: Router,
    private printService: PrintService,
    private toast: HotToastService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //список продуктов
    this.allList();
  }

  updateProduct(id: Guid | undefined) {
    this.router.navigate([`editproduct/${id}`]);
  }


  moreProduct(product: ProductWithDiscount) {
    this.oneProduct = product;
    if (this.oneProduct.discount?.discountType != null) {
      this.index = this.oneProduct.discount?.discountType
    }
  }

  allList() {
    this.isWaiting = true;
    this.producrService.getProductByIdStore(this.storage.getItem('storeId'))
      .subscribe(prod => {
        this.products = prod

        let objectURL: string;

        for (let i = 0; i < prod.length; i++) {
          if (prod[i].image != null) {

            objectURL = 'data:image/jpeg;base64,' + prod[i].image;

            this.products[i].image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        }
        this.oneProduct = this.products[0];
        this.isWaiting = false;
      })
  }

  deleteProduct(product: ProductWithDiscount) {
    if (product.id != null) {
      this.idProductForDeleted = product.id;
    }
    this.oneProduct = product;
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Price tag printed successfully!');
    else this.toast.success('Ценник распечатан успешно!');
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Price tag not printed! Try again.');
    else this.toast.error('Ценник не распечатан! Попробуйте еще.');
  }

  printPriceHolde(id: Guid | undefined) {
    this.isWaiting = true;

    if (id != null) {
      this.printService.printPriceHolder(id).subscribe(date => {
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
    } else {
      if (this.storage.getItem('lang') == Language.en) this.toast.error('Product not delete! Try again.');
      else this.toast.error('Price tag not printed! Try again.');
      this.isWaiting = false;
    }

  }

  idProduct(id: Guid | undefined) {
    if (id != null) {
      this.isWaiting = true;  //ожидание
      this.producrService.deleteProduct(id).subscribe(() => {

        if (this.storage.getItem('lang') == Language.en) this.toast.success('Product delete successfully!');
        else this.toast.success('Продукт удален успешно!');
        this.isWaiting = false;
        this.allList();
      });
    }
    else {
      if (this.storage.getItem('lang') == Language.en) this.toast.error('Product not delete! Try again.');
      else this.toast.error('Продукт не удален! Попробуйте еще.');
      this.isWaiting = false;
    }
  }

}
