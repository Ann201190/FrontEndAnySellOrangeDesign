import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { BalanceProduct } from 'src/app/models/balanceProduct';
import { Coming } from 'src/app/models/coming';
import { Language } from 'src/app/models/enum/language';
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
              price: new FormControl('', [Validators.required, Validators.min(0)]),
              count: new FormControl('', [Validators.required, Validators.min(0)]),
              products: new FormControl(this.products[this.products.length - 1].name, [Validators.required]),
              sum: new FormControl(0)
            })

          })

        this.isWaiting = false;
      })

  }

  addProducts() {

    //массив для вывода на фронт
    let oneProduct: any = {
      comingPrice: this.form_2.value.price,
      productId: this.form_2.value.products,
      count: this.form_2.value.count,
      product: this.products.find(el => el.id == this.form_2.value.products)
    };

    this.totalSum = this.totalSum + (this.form_2.value.price * this.form_2.value.count)
    this.productsAdd.push(oneProduct);

    // this.form_2.reset(); //очищение формы

    this.selectedProductId = this.products[this.products.length - 1].id;
    this.form_2.reset({
      'count': '',
      'price': '',
      'products': this.selectedProductId,
    });
    // this.selectedProductId = this.products[this.products.length - 1].id;
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
      this.productsAdd.splice(index, 1);
    }
  }


  /* updateProduct(product: BalanceProduct) {
 
     this.oneComingBalanceProduct = product;
 
     this.selectedProductId = this.oneComingBalanceProduct.productId
 
     this.form_3 = new FormGroup({
       price: new FormControl(this.oneComingBalanceProduct.comingPrice, [Validators.required, Validators.min(0)]),
       count: new FormControl(this.oneComingBalanceProduct.count, [Validators.required, Validators.min(0)]),
       products: new FormControl(this.selectedProductId),
       sum: new FormControl(this.oneComingBalanceProduct.comingPrice * this.oneComingBalanceProduct.count)
 
     });
 
   }*/


}
