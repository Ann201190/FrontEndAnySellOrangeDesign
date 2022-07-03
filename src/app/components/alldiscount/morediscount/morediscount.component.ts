import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Discount } from 'src/app/models/discount';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { Role } from 'src/app/models/enum/role';
import { Product } from 'src/app/models/product';
import { ProductWithDiscount } from 'src/app/models/productWithDiscount';
import { DiscountService } from 'src/app/services/discount.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-morediscount',
  templateUrl: './morediscount.component.html',
  styleUrls: ['./morediscount.component.css']
})
export class MorediscountComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public products: ProductWithDiscount[] = [];
  public discount!: Discount;
  public discountId!: Guid;
  public DiscountType = DiscountType;
  public role: any;
  public p: any = 0;
  roleType: Array<string> = Object.keys(Role).filter(key => isNaN(+key))
  public isShow: boolean = false;

  constructor(
    public storage: LocalStorageService,
    public translateService: TranslateService,
    private productService: ProductService,
    private discountService: DiscountService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.role = this.storage.getItem('role');
    this.isShow = false;
    this.allList();
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

  addProductDiscount() {
    this.isWaiting = true;
    this.router.navigate([`adddiscountproduct/${this.discountId}`]);
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.route.params.subscribe((params: Params) => {
      this.discountId = params["id"];
      this.discountService.getByIdDiscount(this.discountId).subscribe(dic => {
        this.discount = dic
        this.isWaiting = false;  //ожидание
      });

      this.productService.getProductDiscount(this.discountId)
        .subscribe(prod => {
          this.products = prod

          let objectURL: string;
          for (let i = 0; i < prod.length; i++) {
            this.products[i].checked = false;

            if (prod[i].image != null) {

              objectURL = 'data:image/jpeg;base64,' + prod[i].image;

              this.products[i].image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            }
          }

          this.isWaiting = false;  //ожидание
        })
    })
  }

  deleteAllProducts() {
    this.isWaiting = true;
    let deleteProduct: any[] = [];

    for (let i = 0; i < this.products.length; i++) {

      if (this.products[i].checked) {
        deleteProduct.push(this.products[i].id);
      }
    }

    if (deleteProduct.length != 0) {
      this.discountService.deleteProducDiscount(this.discountId, deleteProduct)
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
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Removeed successfully!');
    else this.toast.success('Удалено успешно!');

    this.allList();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Not removeed! Try again.');
    else this.toast.error('Не удалено! Попробуйте еще.');
  }

  selectedMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Nothing selected.');
    else this.toast.error('Ничего не выбранно.');
  }

  checkAllCheckBox(ev: any) {
    this.products.forEach(x => x.checked = ev.target.checked)
  }

  isAllCheckBoxChecked() {
    return this.products.every(p => p.checked);
  }
}
