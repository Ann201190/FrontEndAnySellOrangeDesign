import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AUTH_API_URL, STORE_API_URL } from './app-injection-tokens';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { ACCESS_TOKEN_KEY } from './services/auth.service';
import { AddProductComponent } from './components/allproduct/addproduct/addproduct.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './components/footer/footer.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { InformationsComponent } from './components/informations/informations.component';
import { ErrorComponent } from './components/error/error.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgxLoadingModule } from 'ngx-loading';
import { HotToastModule } from '@ngneat/hot-toast';
import { ProductComponent } from './components/allproduct/product/product.component';
import { ListproductComponent } from './components/allproduct/listproduct/listproduct.component';
import { AddstoreComponent } from './components/allstore/addstore/addstore.component';
import { ListStoreComponent } from './components/allstore/liststore/liststore.component';
import { StoreComponent } from './components/allstore/store/store.component';
import { NgxMaskModule } from 'ngx-mask';
import { AddstoreemployeeComponent } from './components/allstore/addstoreemployee/addstoreemployee.component';
import { EditstoreComponent } from './components/allstore/editstore/editstore.component';
import { EditproductComponent } from './components/allproduct/editproduct/editproduct.component';
import { ListdiscountComponent } from './components/alldiscount/listdiscount/listdiscount.component';
import { AdddiscountComponent } from './components/alldiscount/adddiscount/adddiscount.component';
import { EditdiscountComponent } from './components/alldiscount/editdiscount/editdiscount.component';
import { DiscountComponent } from './components/alldiscount/discount/discount.component';
import { ListemployeeComponent } from './components/allemployee/listemployee/listemployee.component';
import { AddemployeeComponent } from './components/allemployee/addemployee/addemployee.component';
import { EmployeeComponent } from './components/allemployee/employee/employee.component';
import { EditemployeeComponent } from './components/allemployee/editemployee/editemployee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProviderComponent } from './components/allprovider/provider/provider.component';
import { AddproviderComponent } from './components/allprovider/addprovider/addprovider.component';
import { EditproviderComponent } from './components/allprovider/editprovider/editprovider.component';
import { ListproviderComponent } from './components/allprovider/listprovider/listprovider.component';
import { AddcomingComponent } from './components/allcoming/addcoming/addcoming.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ListcomingComponent } from './components/allcoming/listcoming/listcoming.component';
import { InformationsCashierComponent } from './components/informationscashier/informationscashier.component';
import { MorediscountComponent } from './components/alldiscount/morediscount/morediscount.component';
import { AdddiscountproductComponent } from './components/alldiscount/adddiscountproduct/adddiscountproduct.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderComponent } from './components/allorder/order/order.component';
import { ListorderComponent } from './components/allorder/listorder/listorder.component';

import { HeaderComponent } from './components/header/header.component';
import { SideBarComponent } from './components/sidebar/sidebar.component';
import { AddorderComponent } from './components/allorder/addorder/addorder.component';


export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddProductComponent,
    FooterComponent,
    SideBarComponent,
    SiteLayoutComponent,
    ErrorComponent,
    RegistrationComponent,
    ConfirmComponent,
    InformationsComponent,
    ListStoreComponent,
    ProductComponent,
    ListproductComponent,
    AddstoreComponent,
    StoreComponent,
    AddstoreemployeeComponent,
    EditstoreComponent,
    EditproductComponent,
    ListdiscountComponent,
    AdddiscountComponent,
    EditdiscountComponent,
    DiscountComponent,
    ListemployeeComponent,
    AddemployeeComponent,
    EmployeeComponent,
    EditemployeeComponent,
    ProviderComponent,
    AddproviderComponent,
    EditproviderComponent,
    ListproviderComponent,
    AddcomingComponent,
    ListcomingComponent,
    InformationsCashierComponent,
    MorediscountComponent,
    AdddiscountproductComponent,
    OrderComponent,
    ListorderComponent,
    HeaderComponent,
    AddorderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxMaskModule.forRoot(),
    NgxLoadingModule.forRoot({}),
    ReactiveFormsModule,
    HotToastModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    JwtModule.forRoot(
      {
        config: {
          tokenGetter,
          allowedDomains: environment.tokenWhiteListedDomains
        }
      })
  ],
  providers: [
    {
      provide: AUTH_API_URL,
      useValue: environment.authApi
    },
    {
      provide: STORE_API_URL,
      useValue: environment.storeApi
    }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
function ngxLoadingXConfig(ngxLoadingXConfig: any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
  throw new Error('Function not implemented.');
}

