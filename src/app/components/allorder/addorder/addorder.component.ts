import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { OrderProduct } from 'src/app/models/OrderProduct';

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
  producrForOrder: OrderProduct[] = []
  public selectedProductId?: Guid;
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))

  constructor(
    public translateService: TranslateService,
    private storage: LocalStorageService,
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

        console.log(this.producrForOrder)

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
