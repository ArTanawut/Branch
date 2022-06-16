import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { NgNumberFormatterModule } from 'ng-number-formatter';
import { SelectModule } from 'ng-select';
import { CommonModule } from '@angular/common';
// import { DataTableDirective } from 'angular-datatables';

// import { SelectModule } from 'ng-select';
// import { SelectOptionService } from './theme/shared/components/select/select-option.service';



/* Menu Items */
import { NavigationItem } from './theme/layout/admin/navigation/navigation';
import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './liberty/user-management/user/user.component';
import { RoleComponent } from './liberty/user-management/role/role.component';
import { LoginComponent } from './demo/pages/authentication/login/login.component';
import { DashboardComponent } from './liberty/dashboard/dashboard.component';
import { UomComponent } from './liberty/main-data/uom/uom.component';
import { ProductComponent } from './liberty/main-data/product/product.component';
import { RawMaterialComponent } from './liberty/main-data/raw-material/raw-material.component';
import { ImportRawComponent } from './liberty/raw-material-inventory/import-raw/import-raw.component';
import { ExportRawComponent } from './liberty/raw-material-inventory/export-raw/export-raw.component';
import { StockMovementComponent } from './liberty/report/stock-movement/stock-movement.component';
import { NetProfitComponent } from './liberty/report/net-profit/net-profit.component';
import { PermissionComponent } from './liberty/user-management/permission/permission.component';
import { ShopComponent } from './liberty/shop-management/shop/shop.component';
import { BranchComponent } from './liberty/shop-management/branch/branch.component';
import { ExportRawByimportComponent } from './liberty/raw-material-inventory/export-raw-byimport/export-raw-byimport.component';
import { GroupComponent } from './liberty/main-data/group/group.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ConfigurationComponent,
    UserComponent,
    RoleComponent,
    LoginComponent,
    DashboardComponent,
    UomComponent,
    ProductComponent,
    RawMaterialComponent,
    ImportRawComponent,
    ExportRawComponent,
    StockMovementComponent,
    NetProfitComponent,
    PermissionComponent,
    ShopComponent,
    BranchComponent,
    ExportRawByimportComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    DataTablesModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ModalModule,
    NgbDatepickerModule,
    TextMaskModule,
    NgNumberFormatterModule,
    SelectModule,
    CommonModule,
    // DataTableDirective,
    // SelectModule,
    // SelectOptionService,
  ],
  providers: [NavigationItem, BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
