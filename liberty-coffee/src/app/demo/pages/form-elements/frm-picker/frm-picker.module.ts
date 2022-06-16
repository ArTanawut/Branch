import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrmPickerRoutingModule } from './frm-picker-routing.module';
import { FrmPickerComponent } from './frm-picker.component';
import { SharedModule } from '../../../../theme/shared/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FrmPickerRoutingModule,
    SharedModule,
    ColorPickerModule,
    NgbDatepickerModule
  ],
  declarations: [FrmPickerComponent]
})
export class FrmPickerModule { }
