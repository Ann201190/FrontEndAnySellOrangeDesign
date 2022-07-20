import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Coming } from 'src/app/models/coming';
import { Language } from 'src/app/models/enum/language';
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
  public sum: number = 0;
  public p: any = 0;
  public idComingForDeleted!: Guid;
  public path: string = `https://localhost:44350/api/Product/download/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  public pathAll: string = `https://localhost:44350/api/Product/downloadall/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`


  constructor(
    public storage: LocalStorageService,
    public translateService: TranslateService,
    private comingService: ComingService,
    private router: Router,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }

  deleteComing(coming: Coming) {
    if (coming.id != null) {
      this.idComingForDeleted = coming.id;
    }
    this.oneComing = coming;
    this.sum = this.ComingTotalPrice(this.oneComing);
  }


  download() {
    this.path = `https://localhost:44350/api/Product/download/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  }

  downloadAll() {
    this.pathAll = `https://localhost:44350/api/Product/downloadall/${this.storage.getItem('storeId')}/${this.storage.getItem('lang')}`
  }

  moreComing(coming: Coming) {
    this.oneComing = coming;
    this.totalSum = 0;
    this.oneComing.balanceProducts.forEach(element => {
      this.totalSum = this.ComingTotalPrice(coming)
    });
  }

  public ComingTotalPrice(coming: Coming): number {
    let count: number = 0;
    coming.balanceProducts.forEach(bc => {
      count += bc.comingPrice * bc.count;
    });
    return count;
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.comingService.getComingByIdStore(this.storage.getItem('storeId'))
      .subscribe(com => {
        this.comings = com

        this.isWaiting = false;  //ожидание
      })
  }


  idComing(id: Guid | undefined) {
    if (id != null) {
      this.isWaiting = true;  //ожидание
      this.comingService.deleteComing(id).subscribe(() => {

        if (this.storage.getItem('lang') == Language.en) this.toast.success('Coming delete successfully!');
        else this.toast.success('Приход удален успешно!');
        this.isWaiting = false;
        this.allList();
      });
    }
    else {
      if (this.storage.getItem('lang') == Language.en) this.toast.error('Coming not delete! Perhaps the products from this comings have already been sold.');
      else this.toast.error('Приход не удален! Возможно продукты  с даного прихода уже проданы.');
      this.isWaiting = false;
    }
  }

}
