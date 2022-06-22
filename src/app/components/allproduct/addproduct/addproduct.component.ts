import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HotToastService } from '@ngneat/hot-toast';
import { TranslateService } from '@ngx-translate/core';
import { Language } from 'src/app/models/enum/language';
import { ProductUnit } from 'src/app/models/enum/productunit';
import { Product } from 'src/app/models/product';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddProductComponent implements OnInit {


  @ViewChild('file', { static: false })
  InputVar!: ElementRef;

  public files!: any;
  form!: FormGroup;
  public image: any = null;
  public isWaiting = false;  //ожидание
  productUnitType: Array<string> = Object.keys(ProductUnit).filter(key => isNaN(+key))

  constructor(
    private producrService: ProductService,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    public translateService: TranslateService,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {

    this.translateService.use(this.storage.getItem('lang'))

    //для добавления продукта
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999999999)]),
      file: new FormControl(''),
      barcode: new FormControl('', [Validators.required]),
      productUnit: new FormControl(this.productUnitType[0])
    })
  }

  successMessageWithoutImg() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Product added successfully, but no photo!');
    else this.toast.success('Продукт добавлен успешно, но без фото!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  successMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Product added successfully!');
    else this.toast.success('Продукт добавлен успешно!');

    this.form.reset(); //очищение формы
    window.location.reload();
  }

  errorMessage() {
    if (this.storage.getItem('lang') == Language.en) this.toast.error('Product not added! Try again.');
    else this.toast.error('Продукт не добавлен! Попробуйте еще.');
    window.location.reload();
  }

  //загрузка файла
  onFileChanged(event: any) {
    this.files = event.target.files[0];
    this.image = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.files));
  }

  addProduct() {

    var product: Product = {
      name: this.form.value.name,
      price: this.form.value.price,
      barcode: this.form.value.barcode,
      storeId: this.storage.getItem('storeId'),
      productUnit: ProductUnit[this.form.value.productUnit as keyof typeof ProductUnit]
    }

    this.producrService.addProductWithoutImage(product).subscribe(id => {
      this.isWaiting = true;
      if (id != null) {
        if (this.files) {

          const formData = new FormData();

          formData.append(this.files.name, this.files);

          this.producrService.addProductImage(formData, id).subscribe(() => {

            this.successMessage();
          })
        }
        else {
          this.successMessageWithoutImg();
        }
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


  deleteImg() {

    this.files = null;
    this.image = null;
    this.InputVar.nativeElement.value = "";
    if (this.storage.getItem('lang') == Language.en) this.toast.success('Photo removed!');
    else this.toast.success('Фото удалено!');
  }
}
