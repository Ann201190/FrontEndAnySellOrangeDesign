import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { Product } from 'src/app/models/product';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit {

  public files: any = 0;
  public isWaiting: boolean = false;
  form!: FormGroup;
  public product!: Product;
  @ViewChild('file', { static: false })
  InputVar!: ElementRef;
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))

  constructor(
    private productService: ProductService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    this.translateService.use(this.storage.getItem('lang'))

    /* this.form = new FormGroup({
       name: new FormControl(),
       file: new FormControl(),
       price: new FormControl(),
       barcode: new FormControl(),
       productUnit: new FormControl()
     })*/
    this.isWaiting = true;
    this.route.params.subscribe((params: Params) => {
      let id = params["id"];
      this.productService.getByIdProduct(id).subscribe(oneProduct => {
        this.product = oneProduct;

        if (oneProduct.image != null) {
          let objectURL = 'data:image/jpeg;base64,' + oneProduct.image;
          this.product.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }

        this.form = new FormGroup({
          name: new FormControl(this.product.name, [Validators.required]),
          price: new FormControl(this.product.price, [Validators.required, Validators.min(0), Validators.max(999999999999)]),
          file: new FormControl(),
          barcode: new FormControl(this.product.barcode, [Validators.required]),
          productUnit: new FormControl(this.productUnitType[this.product.productUnit])
        });

      });
      this.isWaiting = false;
    });

  }

  deleteImg() {
    this.files = null;
    this.product.image = undefined;
    this.InputVar.nativeElement.value = "";

    if (this.storage.getItem('lang') == Language.en) this.toast.success('Photo removed!');
    else this.toast.success('Фото удалено!');
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Product information has been successfully changed!');
    else this.toast.success('Информация о продукте успешно изменена!');

    this.router.navigate([`product`]);
  }

  successMessageWithoutImg() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Product information has been successfully changed, the photo has not been changed!');
    else this.toast.success('Информация о продукте успешно изменена, фото не изменено!');

    this.router.navigate([`product`]);
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Changes have not been made. Try again!');
    else this.toast.error('Изменения не внесены. Пробутйте еще раз!');
  }



  editProduct() {
    this.isWaiting = true;
    if (this.product) {
      this.product.name = this.form.value.name,
        this.product.price = this.form.value.price,
        this.product.storeId = this.storage.getItem('storeId'),
        this.product.barcode = this.form.value.barcode,
        this.product.productUnit = ProductUnit[this.form.value.productUnit as keyof typeof ProductUnit]
    }

    this.productService.editProductWithoutImge(this.product).subscribe(id => {

      if (id != null) {

        if (!this.files && this.product.image == null) {
          this.productService.deleteImage(id).subscribe(() => {
            this.successMessageWithoutImg();
          })
        }
        else {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.productService.addProductImage(formData, id).subscribe(() => {

            this.successMessage();
          })
        }
      }
      else {
        this.errorMessage();
      }
    }, err => {
      this.errorMessage();
      this.isWaiting = false;
    });
  }


  onFileChanged(event: any) {
    this.files = event.target.files[0]
    this.product.image = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

}
