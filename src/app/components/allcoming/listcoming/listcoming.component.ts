import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Coming } from 'src/app/models/coming';
import { ComingService } from 'src/app/services/coming.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-listcoming',
  templateUrl: './listcoming.component.html',
  styleUrls: ['./listcoming.component.css']
})
export class ListcomingComponent implements OnInit {

  public isWaiting = false;  //ожидание
  public comings: Coming[] = [];
  public oneComing!: Coming;
  public totalSum: number = 0;
  public p: any = 0;
  public path: string = `https://localhost:44350/api/Product/download/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`

  constructor(
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private comingService: ComingService,
    private router: Router,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }



  download() {
    this.path = `https://localhost:44350/api/Product/download/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  }

  moreComing(coming: Coming) {
    this.oneComing = coming;

    this.oneComing.balanceProducts.forEach(element => {
      this.totalSum = element.comingPrice * element.count
    });
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.comingService.getComingByIdStore(this.storage.getItem('storeId'))
      .subscribe(com => {
        this.comings = com

        this.isWaiting = false;  //ожидание
      })
  }

}
