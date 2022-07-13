import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { InformationsComponent } from './components/informations/informations.component';
import { ProductComponent } from './components/allproduct/product/product.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGard } from './guards/auth.guard';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { StoreComponent } from './components/allstore/store/store.component';
import { AddstoreComponent } from './components/allstore/addstore/addstore.component';
import { EditstoreComponent } from './components/allstore/editstore/editstore.component';
import { EditproductComponent } from './components/allproduct/editproduct/editproduct.component';
import { DiscountComponent } from './components/alldiscount/discount/discount.component';
import { EditdiscountComponent } from './components/alldiscount/editdiscount/editdiscount.component';
import { EmployeeComponent } from './components/allemployee/employee/employee.component';
import { EditemployeeComponent } from './components/allemployee/editemployee/editemployee.component';
import { ProviderComponent } from './components/allprovider/provider/provider.component';
import { EditproviderComponent } from './components/allprovider/editprovider/editprovider.component';
import { AddcomingComponent } from './components/allcoming/addcoming/addcoming.component';
import { ListcomingComponent } from './components/allcoming/listcoming/listcoming.component';
import { InformationsCashierComponent } from './components/informationscashier/informationscashier.component';
import { MorediscountComponent } from './components/alldiscount/morediscount/morediscount.component';
import { AdddiscountproductComponent } from './components/alldiscount/adddiscountproduct/adddiscountproduct.component';
import { AddorderComponent } from './components/allorder/addorder/addorder.component';
import { ListorderComponent } from './components/allorder/listorder/listorder.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';



const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, children:
      [
        { path: '', component: HomeComponent },
        { path: 'registration', component: RegistrationComponent },
        { path: 'confirm/:stringConfirm', component: ConfirmComponent },
        { path: 'information', component: InformationsComponent },
        { path: 'informationcashier', component: InformationsCashierComponent },
      ]
  },
  {
    path: '', component: SiteLayoutComponent, children:
      [
        { path: 'store', component: StoreComponent, canActivate: [AuthGard] },
        { path: 'addstore', component: AddstoreComponent, canActivate: [AuthGard] },
        { path: 'editstore/:id', component: EditstoreComponent, canActivate: [AuthGard] },

        { path: 'product', component: ProductComponent, canActivate: [AuthGard] },
        { path: 'editproduct/:id', component: EditproductComponent, canActivate: [AuthGard] },

        { path: 'discount', component: DiscountComponent, canActivate: [AuthGard] },
        { path: 'editdiscount/:id', component: EditdiscountComponent, canActivate: [AuthGard] },
        { path: 'morediscount/:id', component: MorediscountComponent, canActivate: [AuthGard] },
        { path: 'adddiscountproduct/:id', component: AdddiscountproductComponent, canActivate: [AuthGard] },

        { path: 'employee', component: EmployeeComponent, canActivate: [AuthGard] },
        { path: 'editdemployee/:id', component: EditemployeeComponent, canActivate: [AuthGard] },

        { path: 'provider', component: ProviderComponent, canActivate: [AuthGard] },
        { path: 'editdprovider/:id', component: EditproviderComponent, canActivate: [AuthGard] },

        { path: 'listcoming', component: ListcomingComponent, canActivate: [AuthGard] },
        { path: 'addcoming', component: AddcomingComponent, canActivate: [AuthGard] },

        { path: 'addorder', component: AddorderComponent, canActivate: [AuthGard] },
        { path: 'listorder', component: ListorderComponent, canActivate: [AuthGard] },

        { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGard] }
      ]
  },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
