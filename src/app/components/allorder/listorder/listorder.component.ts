import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Language } from 'src/app/models/enum/language';
import { OrderStatus } from 'src/app/models/enum/orderstatus';
import { Order } from 'src/app/models/order';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';
import { PrintService } from 'src/app/services/print.service';

@Component({
  selector: 'app-listorder',
  templateUrl: './listorder.component.html',
  styleUrls: ['./listorder.component.css']
})
export class ListorderComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public orders: Order[] = [];
  public oneOrder!: Order;
  public totalSum: number = 0;
  public sum: number = 0;
  public p: any = 0;
  public idOrderForDeleted!: Guid;
  public OrderStatus = OrderStatus;
  public index: number = 0;
  orderStatusType: Array<string> = Object.keys(OrderStatus).filter(key => isNaN(+key))

  constructor(
    private toast: HotToastService,
    private printService: PrintService,
    public storage: LocalStorageService,
    public orderService: OrderService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }


  public OrderTotalPrice(order: Order): number {
    let count: number = 0;
    order.reservationProducts.forEach(rp => {
      let discount = 0
      if (rp.discountValue != null && rp.discountValue != 0) {
        discount = rp.discountValue;
      }
      count += rp?.count * (rp?.price - discount);
    });
    return count;
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.orderService.getByStoreId(this.storage.getItem('storeId'))
      .subscribe(ord => {
        this.orders = ord

        this.isWaiting = false;  //ожидание
      })
  }

  moreOrder(orderNumber: any) {

    // this.oneOrder = order;


    this.orderService.getCheck(this.storage.getItem('storeId'), orderNumber).subscribe(ord => {
      this.oneOrder = ord

      if (this.oneOrder.orderStatus != null) {
      this.index = this.oneOrder.orderStatus
    }
    console.log(OrderStatus[this.index])

    this.totalSum = 0;
    this.oneOrder.reservationProducts.forEach(element => {
      this.totalSum = this.OrderTotalPrice(this.oneOrder)
    });

    })
  }


  public priceWithDiscount(price: number, discount: any) {

    if (discount != null) {
      price = price - discount;
    }
    return price
  }


  public sumWithDiscount(price: number, discount: any, count: any) {

    var prices = Number(this.priceWithDiscount(price, discount));

    return prices * count
  }

  printChack(orderNumber: any) {

    this.isWaiting = true;

    this.printService.printCheck(orderNumber).subscribe(date => {
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
}
