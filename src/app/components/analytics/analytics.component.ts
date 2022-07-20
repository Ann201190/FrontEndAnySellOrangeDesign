import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartData, ChartOptions } from 'chart.js';

import { Order } from 'src/app/models/order';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public salesData_1: ChartData<'bar'> | undefined
  public salesData_2: ChartData<'line'> | undefined


  constructor(
    public storage: LocalStorageService,
    public orderService: OrderService,
    public translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.checCashier();
    this.profit()
  }

  checCashier() {
    this.isWaiting = true;  //ожидание
    this.orderService.getChecCashier(this.storage.getItem('storeId'))
      .subscribe(cashierOrders => {

        console.log(cashierOrders);

        this.salesData_1 = {
          labels: cashierOrders.labels,
          datasets: cashierOrders.datasets,
        }

        this.isWaiting = false;  //ожидание
      })
  }

  profit() {
    this.isWaiting = true;  //ожидание
    this.orderService.getProfit(this.storage.getItem('storeId'))
      .subscribe(cashierOrders => {

        console.log(cashierOrders);

        this.salesData_2 = {
          labels: cashierOrders.labels,
          datasets: cashierOrders.datasets
        }

        this.isWaiting = false;  //ожидание
      })
  }

  /* salesData2: ChartData<'bar'> = {
     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
     datasets: [
       { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500] },
       { label: 'Laptop', data: [200, 100, 400, 50, 90] },
       { label: 'AC', data: [500, 400, 350, 450, 650] },
       { label: 'Headset', data: [1200, 1500, 1020, 1600, 900] },
     ],
   };
 
 
 
 
   salesData: ChartData<'bar'> = {
     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
     datasets: [
       { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500] },
       { label: 'Laptop', data: [200, 100, 400, 50, 90] },
       { label: 'AC', data: [500, 400, 350, 450, 650] },
       { label: 'Headset', data: [1200, 1500, 1020, 1600, 900] },
     ],
   };*/

  chartOptions_1: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Какой кассир сколько продал вывод по чекам',
      },
    },
  };

  chartOptions_2: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Прибыль',
      },
    },
  };


  salesData1: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500], tension: 0.5 },
      { label: 'Laptop', data: [200, 100, 400, 50, 90], tension: 0.5 },
      { label: 'AC', data: [500, 400, 350, 450, 650], tension: 0.5 },
      { label: 'Headset', data: [1200, 1500, 1020, 1600, 900], tension: 0.5 },
    ],
  };

  /*  salesData2: ChartData<'pie'> = {
     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
     datasets: [
       { label: 'Mobiles', data: [1000, 1200, 1050, 2000, 500] },
       { label: 'Laptop', data: [200, 100, 400, 50, 90] },
       { label: 'AC', data: [500, 400, 350, 450, 650] },
       { label: 'Headset', data: [1200, 1500, 1020, 1600, 900] },
     ],
   };*/

}
