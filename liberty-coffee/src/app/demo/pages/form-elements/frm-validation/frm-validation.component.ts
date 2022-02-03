import { Component, OnInit } from '@angular/core';

export class FormInput {
  email: any;
  password: any;
  requiredInput: any;
  phone: any;
  cmbGear: any;
  address: any;
  file: any;
  switcher: any;
}

@Component({
  selector: 'app-frm-validation',
  templateUrl: './frm-validation.component.html',
  styleUrls: ['./frm-validation.component.scss']
})
export class FrmValidationComponent implements OnInit {
  formInput: FormInput;
  form: any;
  public isSubmit: boolean;
  constructor() {
    this.isSubmit = false;
  }

  ngOnInit() {
    this.formInput = {
      email: '',
      password: '',
      requiredInput: '',
      phone: '',
      cmbGear: '',
      address: '',
      file: '',
      switcher: ''
    };
  }

  /*confirmPassword: '',*/
  /*url: '',*/

  save(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    }
  }

}
