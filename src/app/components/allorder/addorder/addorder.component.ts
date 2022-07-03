import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { Order } from 'src/app/models/order';
import { OrderProduct } from 'src/app/models/OrderProduct';
import { Product } from 'src/app/models/product';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-addorder',
  templateUrl: './addorder.component.html',
  styleUrls: ['./addorder.component.css']
})
export class AddorderComponent implements OnInit {

  public isWaiting = false;  //ожидание
  form!: FormGroup;
  public totalSum: number = 0
  producrForOrder: OrderProduct[] = []
  public selectedProductId?: Guid;
  public p: any = 0;
  public productsAdd: any[] = [];
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))

  constructor(
    public translateService: TranslateService,
    public storage: LocalStorageService,
    private orderService: OrderService) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form = new FormGroup({
      products: new FormControl(),
      count: new FormControl()
    })

    this.isWaiting = true;

    this.orderService.getOrderByIdStore(this.storage.getItem('storeId')).subscribe(
      prodforord => {
        this.producrForOrder = prodforord

        this.producrForOrder = prodforord.map((i) => { i.name = i.name + ' (' + i.barcode + ')'; return i; });

        this.selectedProductId = this.producrForOrder[this.producrForOrder.length - 1].id;

        this.isWaiting = false;
      }
    )

    this.form = new FormGroup({
      count: new FormControl('', [Validators.required, Validators.min(0)]),
      products: new FormControl(this.producrForOrder[this.producrForOrder.length - 1].name, [Validators.required]),

    })
  }


  addProduct() {

    let prod = this.producrForOrder.find(el => el.id == this.form.value.products)
    console.log(prod)
    //массив для вывода на фронт

    let oneProduct: any = {
      name: prod?.name,
      productId: prod?.id,
      count: this.form.value.count,
      price: prod?.priceWithDiscount,
      barcode: prod?.barcode,
      productUnit: prod?.productUnit
    };

    if (prod != null) {
      this.totalSum = this.totalSum + (prod?.priceWithDiscount * this.form.value.count)
    }

    this.productsAdd.push(oneProduct);

    // this.form_2.reset(); //очищение формы

    this.selectedProductId = this.producrForOrder[this.producrForOrder.length - 1].id;
    this.form.reset({
      'count': '',
      'products': this.selectedProductId,
    });
    // this.selectedProductId = this.products[this.products.length - 1].id;
  }

  deleteProduct(product: any) {
    const index: number = this.productsAdd.indexOf(product);
    if (index !== -1) {
      this.totalSum = this.totalSum - (product.price * product.count);
      this.productsAdd.splice(index, 1);
    }
  }

  addOrder() {

    /*  var product: Product = {
        name: this.form.value.name,
        price: this.form.value.price,
        barcode: this.form.value.barcode,
        storeId: this.storage.getItem('storeId'),
        productUnit: ProductUnit[this.form.value.productUnit as keyof typeof ProductUnit]
      }*/

    /*  this.producrService.addProductWithoutImage(product).subscribe(id => {
      this.isWaiting = true;
    if (id != null) {
        if (this.files) {
  
          const formData = new FormData();
  
          formData.append(this.files.name, this.files);
  
          this.producrService.addProductImage(formData, id).subscribe(() => {
  
            this.successMessage();
          })
        }
        else {
          this.successMessageWithoutImg();
        }
      }
      else {
        this.errorMessage();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    })*/
  }


}
