import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { CoreChartModule } from './demo/pages/core-chart/core-chart.module';
import { AuthComponent } from './theme/layout/auth/auth.component';
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

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent },
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [

      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: UserComponent },
      { path: 'role', component: RoleComponent },
      { path: 'product', component: ProductComponent },
      { path: 'raw-material', component: RawMaterialComponent },
      { path: 'uom', component: UomComponent },
      { path: 'import-raw', component: ImportRawComponent },
      { path: 'export-raw', component: ExportRawComponent },
      { path: 'export-raw-byimport', component: ExportRawByimportComponent },
      { path: 'stock-movement', component: StockMovementComponent },
      { path: 'net-profit', component: NetProfitComponent },
      { path: 'permission', component: PermissionComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'branch', component: BranchComponent },
      {
        path: 'dashboard',
        loadChildren: () => import('./demo/dashboard/dashboard.module').then(module => module.DashboardModule)
      },
      {
        path: 'layout',
        loadChildren: () => import('./demo/pages/layout/layout.module').then(module => module.LayoutModule)
      },
      {
        path: 'widget',
        loadChildren: () => import('./demo/widget/widget.module').then(module => module.WidgetModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./demo/users/users.module').then(module => module.UsersModule)
      },
      {
        path: 'basic',
        loadChildren: () => import('./demo/ui-elements/ui-basic/ui-basic.module').then(module => module.UiBasicModule)
      },
      {
        path: 'advance',
        loadChildren: () => import('./demo/ui-elements/ui-adv/ui-adv.module').then(module => module.UiAdvModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./demo/pages/form-elements/form-elements.module').then(module => module.FormElementsModule)
      },
      {
        path: 'tbl-bootstrap',
        loadChildren: () => import('./demo/pages/tables/tbl-bootstrap/tbl-bootstrap.module').then(module => module.TblBootstrapModule)
      },
      {
        path: 'tbl-datatable',
        loadChildren: () => import('./demo/pages/tables/tbl-datatable/tbl-datatable.module').then(module => module.TblDatatableModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./demo/pages/core-chart/core-chart.module').then(module => module.CoreChartModule)
      },
      {
        path: 'maps',
        loadChildren: () => import('./demo/pages/core-maps/core-maps.module').then(module => module.CoreMapsModule)
      },
      {
        path: 'email',
        loadChildren: () => import('./demo/application/email/email.module').then(module => module.EmailModule)
      },
      {
        path: 'task',
        loadChildren: () => import('./demo/application/task/task.module').then(module => module.TaskModule)
      },
      {
        path: 'todo',
        loadChildren: () => import('./demo/application/todo/todo.module').then(module => module.TodoModule)
      },
      {
        path: 'gallery',
        loadChildren: () => import('./demo/application/gallery/gallery.module').then(module => module.GalleryModule)
      },
      {
        path: 'helpdesk',
        loadChildren: () => import('./demo/application/helpdesk/helpdesk.module').then(module => module.HelpdeskModule)
      },
      {
        path: 'editor',
        loadChildren: () => import('./demo/extension/editor/editor.module').then(module => module.EditorModule)
      },
      {
        path: 'invoice',
        loadChildren: () => import('./demo/extension/invoice/invoice.module').then(module => module.InvoiceModule)
      },
      {
        path: 'full-calendar',
        loadChildren: () => import('./demo/extension/full-event-calendar/full-event-calendar.module')
          .then(module => module.FullEventCalendarModule)
      },
      {
        path: 'file-upload',
        loadChildren: () => import('./demo/extension/files-upload/files-upload.module').then(module => module.FilesUploadModule)
      },
      {
        path: 'sample-page',
        loadChildren: () => import('./demo/pages/sample-page/sample-page.module').then(module => module.SamplePageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
