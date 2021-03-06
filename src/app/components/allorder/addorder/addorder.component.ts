import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { OrderProduct } from 'src/app/models/OrderProduct';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css']
})
export class AddorderComponent implements OnInit {

  public isWaiting = false;  //ожидание
  form!: FormGroup;
  public totalSum: number = 0
  public producrForOrder: OrderProduct[] = []
  public selectedProductId?: Guid;
  public p: any = 0;
  public cashboxProduct: any[] = [];
  public productsAdd: any[] = [];
  public myAngularxQrCode: string = "";
  public order: string = "";
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))

  constructor(
    public translateService: TranslateService,
    public storage: LocalStorageService,
    private toast: HotToastService,
    private router: Router,
    private printService: PrintService,
    private orderService: OrderService) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form = new FormGroup({
      products: new FormControl(),
      count: new FormControl('', [Validators.required, Validators.min(1)])
    })

    this.isWaiting = true;

    this.orderService.getProductByStoreId(this.storage.getItem('storeId')).subscribe(
      prodforord => {
        this.producrForOrder = prodforord

        this.producrForOrder = prodforord.map((i) => { i.name = i.name + ' (' + i.barcode + ')'; return i; });

        this.selectedProductId = this.producrForOrder[this.producrForOrder.length - 1].id;

        this.isWaiting = false;
      }
    )

    this.form = new FormGroup({
      count: new FormControl('', [Validators.required, Validators.min(1)]),
      products: new FormControl(this.producrForOrder[this.producrForOrder.length - 1].name, [Validators.required]),

    })
  }

  minusProduct(product: any) {

    let prod = this.producrForOrder.find(el => el.id == product.productId)

    if (this.productsAdd.some(x => x.productId === prod?.id)) {
      let index = this.productsAdd.findIndex(x => x.productId === prod?.id)

      if (this.productsAdd[index].count > 1) {
        this.productsAdd[index].count = this.productsAdd[index].count - 1;
        if (prod != null) {
          this.totalSum = this.totalSum - prod?.priceWithDiscount
          this.totalSum = +this.totalSum.toFixed(2)
        }
      }
    }
  }

  plusProduct(product: any) {

    let prod = this.producrForOrder.find(el => el.id == product.productId)

    if (this.productsAdd.some(x => x.productId === prod?.id)) {
      let index = this.productsAdd.findIndex(x => x.productId === prod?.id)

      this.productsAdd[index].count = this.productsAdd[index].count + 1;
      if (prod != null) {
        this.totalSum = this.totalSum + prod?.priceWithDiscount
        this.totalSum = + this.totalSum.toFixed(2)
      }
    }
  }


  printChack() {

    this.isWaiting = true;

    this.printService.printCheck(this.order).subscribe(date => {
      if (date) {
        this.successMessagePrint();
      }
      else {
        this.errorMessagePrint();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessagePrint();
      this.isWaiting = false;
    })
  }

  successMessagePrint() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Print successful!');
    else this.toast.success('Печать успешна!');
  }

  errorMessagePrint() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Print not successful! Try again.');
    else this.toast.error('Печать не успешна! Попробуйте еще.');
  }


  addProduct() {

    let prod = this.producrForOrder.find(el => el.id == this.form.value.products)

    var count = this.form.value.count
    if (prod?.productUnit == ProductUnit.Piece) {
      count = parseInt(count, 10)
    }
    else {
      count = count.toFixed(3);
    }

    //массив для вывода на фронт
    let oneProduct: any = {
      name: prod?.name,
      productId: prod?.id,
      count: count,
      price: prod?.priceWithDiscount,
      barcode: prod?.barcode,
      productUnit: prod?.productUnit
    };

    if (this.productsAdd.some(x => x.productId === prod?.id)) {

      let index = this.productsAdd.findIndex(x => x.productId === prod?.id)
      this.productsAdd[index].count = this.productsAdd[index].count + this.form.value.count;
    }
    else {
      this.productsAdd.push(oneProduct);
    }

    if (prod != null) {
      this.totalSum = this.totalSum + (prod?.priceWithDiscount * this.form.value.count)
      this.totalSum = +this.totalSum.toFixed(2)
    }

    this.selectedProductId = this.producrForOrder[this.producrForOrder.length - 1].id;
    this.form.reset({
      'count': '',
      'products': this.selectedProductId,
    });
  }

  deleteProduct(product: any) {
    const index: number = this.productsAdd.indexOf(product);
    if (index !== -1) {
      this.totalSum = this.totalSum - (product.price * product.count);
      this.totalSum = +this.totalSum.toFixed(2)
      this.productsAdd.splice(index, 1);
    }
  }

  addOrder() {

    //массив продуктов для передачи на бек
    for (let i = 0; i < this.productsAdd.length; i++) {
      let product: any = {
        productId: this.productsAdd[i].productId,
        count: this.productsAdd[i].count
      };
      this.cashboxProduct.push(product);
    }

    var order: any = {

      storeId: this.storage.getItem('storeId'),
      product: this.cashboxProduct
    }
    this.isWaiting = true;

    this.orderService.addOrder(order).subscribe(addCom => {
      if (addCom.access_qrcode == 'error') {
        this.errorMessage();

        this.order = addCom.access_qrcode
      }
      else {
        this.successMessage();
        this.myAngularxQrCode = addCom.access_qrcode

        var n = addCom.access_qrcode.split("/");
        this.order = n[n.length - 1];

      }
      this.isWaiting = false

    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    })
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Sale successful!');
    else this.toast.success('Продажа успешна!');

    this.form.reset(); //очищение формы
    // window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Sale not successful! Try again.');
    else this.toast.error('Продажа не успешна! Попробуйте еще.');
    this.form.reset(); //очищение формы
    //  window.location.reload();
  }

  Close() {
    window.location.reload();
  }
}
