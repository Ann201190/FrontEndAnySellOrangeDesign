import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Discount } from 'src/app/models/discount';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { DiscountService } from 'src/app/services/discount.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-adddiscount',
  templateUrl: './adddiscount.component.html',
  styleUrls: ['./adddiscount.component.css']
})
export class AdddiscountComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public isWaiting = false;  //ожидание
  discountType: Array<string> = Object.keys(DiscountType).filter(key => isNaN(+key))

  constructor(
    private discountService: DiscountService,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required, Validators.min(0)]),
      discount: new FormControl(this.discountType[0]),
    })
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Discont added successfully!');
    else this.toast.success('Скидка добавленна успешно!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Discont not added! Try again.');
    else this.toast.error('Скидка не добавлена! Попробуйте еще.');
    this.form.reset(); //очищение формы
    window.location.reload();
  }

  addDiscount() {

    var discount: Discount = {
      name: this.form.value.name,
      value: this.form.value.value,
      storeId: this.storage.getItem('storeId'),
      discountType: DiscountType[this.form.value.discount as keyof typeof DiscountType]
    }
    this.isWaiting = true;
    this.discountService.addDiscount(discount).subscribe(addDisc => {

      if (addDisc) {
        this.successMessage();
      }
      else {
        this.errorMessage();
      }
      this.isWaiting = false
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    })
  }

}
