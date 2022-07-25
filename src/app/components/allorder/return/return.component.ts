import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { OrderStatus } from 'src/app/models/enum/orderstatus';
import { Order } from 'src/app/models/order';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.css']
})
export class ReturnComponent implements OnInit {

  public isWaiting = false;  //ожидание
  form!: FormGroup;
  public order!: Order;
  public p: any = 0;
  public isShow: boolean = false;

  statusType: Array<string> = Object.keys(OrderStatus).filter(key => isNaN(+key))

  constructor(
    public storage: LocalStorageService,
    private orderService: OrderService,
    private toast: HotToastService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))



    //для добавления cотрудника
    this.form = new FormGroup({

      orderNumber: new FormControl('', [Validators.required])

    })

  }

  checkAllCheckBox(ev: any) {
    this.order.reservationProducts.forEach(x => x.checked = ev.target.checked)
  }

  isAllCheckBoxChecked() {
    return this.order.reservationProducts.every(p => p.checked);
  }

  fieldsChangeShowUrna(): void {
    this.isShow = false;
    for (let i = 0; i < this.order.reservationProducts.length; i++) {
      if (this.order.reservationProducts[i].checked) {
        console.log(this.order.reservationProducts[i].checked);
        this.isShow = true;
        return;
      }
    }
  }


  discountValue(discount: any, count: number): number {
    let discounts = 0
    if (discount != null && discount > 0) {
      discounts += discount * count
    }
    else {
      discounts += discount * count;
    }

    return Number(discounts);
  }


  search() {

    this.orderService.getCheck(this.storage.getItem('storeId'), this.form.value.orderNumber).subscribe(data => {

      if (data == null) {
        this.errorMessage()
      }
      this.order = data;
      this.isWaiting = false;


      console.log(this.statusType[1])
      console.log(this.order.orderStatus)
    })



  }


  ComingTotalDiscount(): number {
    let discount: number = 0;
    this.order.reservationProducts.forEach(rp => {
      if (rp.discountValue != null && rp.discountValue > 0)
        discount += rp.discountValue * rp.count;
    });
    return discount;
  }


  public ComingTotalPrice(): number {
    let count: number = 0;
    this.order.reservationProducts.forEach(rp => {
      if (rp.discountValue != null && rp.discountValue > 0) {
        count += (rp.price - rp.discountValue) * rp.count;
      }
      else {
        count += rp.price * rp.count;
      }
    });
    return count;
  }


  deleteAllProducts() {


    /*    this.isWaiting = true;
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
      } */
  }



  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Check not found in this store! Try again.');
    else this.toast.error('Чек не найден в этом магазине! Попробуйте еще.');
    //   window.location.reload();
  }

}
