import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Discount } from 'src/app/models/discount';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { ProductWithDiscount } from 'src/app/models/productWithDiscount';
import { DiscountService } from 'src/app/services/discount.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-adddiscountproduct',
  templateUrl: './adddiscountproduct.component.html',
  styleUrls: ['./adddiscountproduct.component.css']
})
export class AdddiscountproductComponent implements OnInit {

  public isWaiting = false;  //ожидание
  discountId!: Guid;
  public discount!: Discount;
  public products: ProductWithDiscount[] = [];
  public isShow: boolean = false;
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))
  public DiscountType = DiscountType;


  constructor(
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private productService: ProductService,
    private discountService: DiscountService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.isWaiting = true;

    this.allList();

  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.route.params.subscribe((params: Params) => {
      this.discountId = params["id"];

      this.discountService.getByIdDiscount(this.discountId).subscribe(dic => {
        this.discount = dic
        this.isWaiting = false;  //ожидание
      });

      this.productService.getProductsWithoutDiscount(this.discountId)
        .subscribe(prod => {
          this.products = prod
          console.log(this.products)
          let objectURL: string;
          for (let i = 0; i < prod.length; i++) {
            this.products[i].checked = false;

            if (prod[i].image != null) {

              objectURL = 'data:image/jpeg;base64,' + prod[i].image;

              this.products[i].image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }

            this.products[i].index = prod[i].discount?.discountType

          }

          this.isWaiting = false;  //ожидание
        })
    })
  }

  fieldsChangeShowUrna(): void {
    this.isShow = false;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].checked) {
        console.log(this.products[i].checked);
        this.isShow = true;
        return;
      }
    }
  }

  checkAllCheckBox(ev: any) {
    this.products.forEach(x => x.checked = ev.target.checked)
  }

  isAllCheckBoxChecked() {
    return this.products.every(p => p.checked);
  }


  addAllProducts() {
    this.isWaiting = true;
    let addProduct: any[] = [];

    for (let i = 0; i < this.products.length; i++) {

      if (this.products[i].checked) {
        addProduct.push(this.products[i].id);
      }
    }

    if (addProduct.length != 0) {
      this.discountService.addProducDiscount(this.discountId, addProduct)
        .subscribe(disc => {
          if (disc) {
            this.successMessage()
            this.isShow = false;
          }
          else {
            this.errorMessage()
          }

          this.isWaiting = false;  //ожидание
        })
    }
    else {
      this.selectedMessage();
    }
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Discount added successfully!');
    else this.toast.success('Скидка добавленна успешно!');

    this.allList();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Failed to add discount! Try again.');
    else this.toast.error('Не удалось добавить скидку! Попробуйте еще.');
  }

  selectedMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Nothing selected.');
    else this.toast.error('Ничего не выбранно.');
  }
}
