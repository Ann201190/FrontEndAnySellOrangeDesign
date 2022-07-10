import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { OrderStatus } from 'src/app/models/enum/orderstatus';
import { Order } from 'src/app/models/order';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';

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
  public index!: number;



  constructor(
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
      count += rp?.count * rp?.price;
    });
    return count;
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.orderService.getByStoreIdAsync(this.storage.getItem('storeId'))
      .subscribe(ord => {
        this.orders = ord

        this.isWaiting = false;  //ожидание
      })
  }

  moreOrder(order: Order) {

    this.oneOrder = order;

    if (this.oneOrder.orderStatus != null) {
      this.index = this.oneOrder.orderStatus
    }

    this.totalSum = 0;
    this.oneOrder.reservationProducts.forEach(element => {
      this.totalSum = this.OrderTotalPrice(order)
    });
  }

}
