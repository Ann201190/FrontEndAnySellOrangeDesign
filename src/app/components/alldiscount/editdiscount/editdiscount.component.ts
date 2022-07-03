import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Discount } from 'src/app/models/discount';
import { DiscountType } from 'src/app/models/enum/discounttype';
import { Language } from 'src/app/models/enum/language';
import { DiscountService } from 'src/app/services/discount.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-editdiscount',
  templateUrl: './editdiscount.component.html',
  styleUrls: ['./editdiscount.component.css']
})
export class EditdiscountComponent implements OnInit {

  public files: any = 0;
  form!: FormGroup;
  public discount!: Discount;
  isWaiting = false;

  discountType: Array<string> = Object.keys(DiscountType).filter(key => isNaN(+key))

  constructor(
    private discountService: DiscountService,
    private router: Router,
    private route: ActivatedRoute,
    public storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))

    /* this.form = new FormGroup({
       name: new FormControl(),
       value: new FormControl(),
       discount: new FormControl(),
     })*/
    this.isWaiting = true;
    this.route.params.subscribe((params: Params) => {
      let id = params["id"];
      this.discountService.getByIdDiscount(id).subscribe(oneDiscount => {
        this.discount = oneDiscount;

        this.form = new FormGroup({
          name: new FormControl(this.discount.name, [Validators.required]),
          value: new FormControl(this.discount.value, [Validators.required, Validators.min(0), Validators.max(100)]),
          discount: new FormControl(this.discountType[this.discount.discountType])
        });
        this.isWaiting = false;
      });
    });
  }


  editDiscount() {
    if (this.discount) {
      this.discount.name = this.form.value.name,
        this.discount.value = this.form.value.value,
        this.discount.storeId = this.storage.getItem('storeId'),
        this.discount.discountType = DiscountType[this.form.value.discount as keyof typeof DiscountType]
    }
    this.isWaiting = false;
    this.discountService.editDiscount(this.discount).subscribe(disc => {

      if (disc) {
        this.successMessage();
      }
      else {
        this.errorMessage();
      }
      this.isWaiting = false;
    },
      err => {
        this.errorMessage();
        this.isWaiting = false;
      })
  }


  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Discont edited successfully!');
    else this.toast.success('Скидка отредактированна успешно!');
    this.router.navigate([`discount`]);
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Discont not edited! Try again.');
    else this.toast.error('Скидка не отредактированна! Попробуйте еще.');
  }
}
