import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Guid } from 'guid-typescript';
import { Discount } from 'src/app/models/discount';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { DiscountService } from 'src/app/services/discount.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-listdiscount',
  templateUrl: './listdiscount.component.html',
  styleUrls: ['./listdiscount.component.css']
})
export class ListdiscountComponent implements OnInit {
  public isWaiting = false;  //ожидание
  public discounts: Discount[] = [];
  public DiscountType = DiscountType;
  public idDiscountForDeleted!: Guid;
  public oneDiscount!: Discount;
  public p: any = 0;

  constructor(

    private storage: LocalStorageService,
    public translateService: TranslateService,
    private discountService: DiscountService,
    private router: Router,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))
    this.allList();
  }

  allList() {
    this.isWaiting = true;  //ожидание
    this.discountService.getDiscountByIdStore(this.storage.getItem('storeId'))
      .subscribe(disc => {
        this.discounts = disc
        this.oneDiscount = this.discounts[0];
        this.isWaiting = false;  //ожидание
      })
  }

  deleteDiscount(discount: Discount) {
    if (discount.id != null) {
      this.idDiscountForDeleted = discount.id;
    }
    this.oneDiscount = discount;
  }

  idDiscount(id: Guid | undefined) {

    if (id != null) {
      this.isWaiting = true;  //ожидание
      this.discountService.deleteDiscount(id)
        .subscribe(disc => {
          if (disc) {
            this.successMessage();
          }
          else {
            this.errorMessage();
          }
          this.isWaiting = false
        }, err => {
          this.errorMessage();
          this.isWaiting = false
        });
    };
  }


  updateDiscount(id: Guid | undefined) {
    this.isWaiting = true;
    this.router.navigate([`editdiscount/${id}`]);
  }


  moreDiscount(id: Guid | undefined) {
    this.router.navigate([`morediscount/${id}`]);
  }


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Discont removeed successfully!');
    else this.toast.success('Скидка удалена успешно!');

    this.allList();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Discont not removeed! May be some products has this discount.');
    else this.toast.error('Скидка не удалена! Возможно существуют товары с этой скидкой.');
  }
}
