import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { BalanceProduct } from 'src/app/models/balanceProduct';
import { Coming } from 'src/app/models/coming';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { Product } from 'src/app/models/product';
import { Provider } from 'src/app/models/provider';
import { ComingService } from 'src/app/services/coming.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';
import { ProviderService } from 'src/app/services/provider.service';

@Component({
  selector: 'app-addcoming',
  templateUrl: './addcoming.component.html',
  styleUrls: ['./addcoming.component.css']
})
export class AddcomingComponent implements OnInit {

  public selectedProductId?: Guid;
  public selectedProviderId?: Guid;
  public isWaiting = false;  //ожидание
  public products: Product[] = [];
  public providers: Provider[] = [];
  public comingProducts: BalanceProduct[] = [];
  public productsAdd: any[] = [];
  public totalSum: number = 0;
  public sumProduct: number = 0;
  public p: any = 0;
  public oneComingBalanceProduct!: BalanceProduct

  public price = 0;
  public count = 0;
  public countModal = 0;
  public priceModal = 0;
  form_1!: FormGroup;
  form_2!: FormGroup;
  form_3!: FormGroup;


  constructor(
    public providerService: ProviderService,
    public productService: ProductService,
    public comingService: ComingService,
    private toast: HotToastService,
    public translateService: TranslateService,
    public storage: LocalStorageService,
    private router: Router,
    private producrService: ProductService
  ) { }



  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form_1 = new FormGroup({
      numberComing: new FormControl(),
      providers: new FormControl(),

    })

    this.form_2 = new FormGroup({
      price: new FormControl(),
      count: new FormControl(),
      products: new FormControl(),
      sum: new FormControl()
    })

    this.form_3 = new FormGroup({
      price: new FormControl(),
      count: new FormControl(),
      products: new FormControl(),
      sum: new FormControl()
    })


    this.isWaiting = true;
    this.producrService.getProductByIdStore(this.storage.getItem('storeId'))
      .subscribe(prod => {
        this.products = prod

        this.products = prod.map((i) => { i.name = i.name + ' (' + i.barcode + ')'; return i; });

        this.providerService.getProvider()
          .subscribe(prov => {
            this.providers = prov


            this.selectedProviderId = this.providers[this.providers.length - 1].id;
            this.selectedProductId = this.products[this.products.length - 1].id;


            this.form_1 = new FormGroup({
              numberComing: new FormControl('', [Validators.required]),
              providers: new FormControl(this.providers[this.providers.length - 1].name),
            })

            this.form_2 = new FormGroup({
              price: new FormControl('', [Validators.required, Validators.min(0.01)]),
              count: new FormControl('', [Validators.required, Validators.min(1)]),
              products: new FormControl(this.products[this.products.length - 1].name, [Validators.required]),
              sum: new FormControl(0)
            })



            this.form_3 = new FormGroup({
              price: new FormControl('', [Validators.required, Validators.min(1)]),
              count: new FormControl('', [Validators.required, Validators.min(1)]),
              products: new FormControl(this.products[this.products.length - 1].name, [Validators.required]),
              sum: new FormControl(0)
            })

          })

        this.isWaiting = false;
      })

  }


  /*int(price: number, count: number, selectedProductId: any) {
    let product = this.products.find(el => el.id == selectedProductId)
    let countNew: number = 0.0;
    if (product?.productUnit == ProductUnit.Piece) {
      countNew = Number((parseInt(count.toString(), 10) * price).toFixed(2))
    }
    else {
      countNew = Number((Number(count.toFixed(3)) * price).toFixed(2));
    }
    return countNew;
  }*/

  /*total(comingPrice: any, count: any) {

    let product = this.products.find(el => el.id == this.form_2.value.products)
    var count = this.form_2.value.count
    if (product?.productUnit == ProductUnit.Piece) {
      count = parseInt(count, 10)
    }
    else {
      count = count.toFixed(3);
    }
  }*/


  addProducts() {

    //массив для вывода на фронт
    let product = this.products.find(el => el.id == this.form_2.value.products)
    var count: number = 0;

    if (product?.productUnit == ProductUnit.Piece) {
      count = parseInt(this.form_2.value.count, 10)
    }
    else {
      count = this.form_2.value.count.toFixed(3);
    }

    let oneProduct: any = {
      comingPrice: Number(this.form_2.value.price.toFixed(2)),
      productId: this.form_2.value.products,
      count: count,
      product: product
    };

    this.sumProduct = Number((this.form_2.value.price.toFixed(2) * count).toFixed(2))
    this.totalSum = this.totalSum + Number(this.sumProduct.toFixed(2))

    this.productsAdd.push(oneProduct);

    // this.form_2.reset(); //очищение формы

    this.selectedProductId = this.products[this.products.length - 1].id;
    this.form_2.reset({
      'sum': '',
      'count': '',
      'price': '',
      'products': this.selectedProductId,
    });
    // this.selectedProductId = this.products[this.products.length - 1].id;
  }


  sum(price: any, count: any) {


  }

  addComing() {

    //массив BalanceProduct для передачи на бек
    for (let i = 0; i < this.productsAdd.length; i++) {
      let oneBalanceProduct: BalanceProduct = {
        comingPrice: this.productsAdd[i].comingPrice,
        productId: this.productsAdd[i].productId,
        count: this.productsAdd[i].count
      };
      this.comingProducts.push(oneBalanceProduct);
    }

    var coming: Coming = {
      number: this.form_1.value.numberComing,
      providerId: this.form_1.value.providers,
      storeId: this.storage.getItem('storeId'),
      balanceProducts: this.comingProducts
    }
    this.isWaiting = true;
    this.comingService.addComing(coming).subscribe(addCom => {
      if (addCom) {
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

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Coming added successfully!');
    else this.toast.success('Приход добавлен успешно!');

    this.form_1.reset(); //очищение формы 1   
    this.form_2.reset(); //очищение формы 2
    this.router.navigate([`listcoming`]);
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Coming not added! Try again.');
    else this.toast.error('Приход не добавлен! Попробуйте еще.');
    //this.form.reset(); //очищение формы
    //  window.location.reload();
  }


  deleteProduct(product: BalanceProduct) {
    const index: number = this.productsAdd.indexOf(product);
    if (index !== -1) {
      this.totalSum = this.totalSum - (product.count * product.comingPrice);
      this.totalSum = +this.totalSum.toFixed(2)
      this.productsAdd.splice(index, 1);
    }
  }

  minusProduct(product: any) {

    let prod = this.products.find(el => el.id == product.productId)

    if (this.productsAdd.some(x => x.productId === prod?.id)) {
      let index = this.productsAdd.findIndex(x => x.productId === prod?.id)

      if (this.productsAdd[index].count > 1) {
        this.productsAdd[index].count = this.productsAdd[index].count - 1;
        if (prod != null) {
          this.totalSum = this.totalSum - this.productsAdd[index].comingPrice
          this.totalSum = +this.totalSum.toFixed(2)
        }
      }
    }
  }

  plusProduct(product: any) {

    let prod = this.products.find(el => el.id == product.productId)

    if (this.productsAdd.some(x => x.productId === prod?.id)) {
      let index = this.productsAdd.findIndex(x => x.productId === prod?.id)

      this.productsAdd[index].count = this.productsAdd[index].count + 1;
      if (prod != null) {
        this.totalSum = this.totalSum + this.productsAdd[index].comingPrice
        this.totalSum = +this.totalSum.toFixed(2)
      }
    }
  }
}
