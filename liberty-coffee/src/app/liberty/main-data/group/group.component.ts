import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { first } from 'rxjs/operators';
import { async } from 'rxjs/internal/scheduler/async';
import { stringify } from '@angular/compiler/src/util';
import { environment } from 'src/environments/environment';

export class FormInput {
  UOM_Name: any;
}

export class FormInput2 {
  UOMID_1: any
  Quantity_1: any
  UOMID_2: any
  Quantity_2: any
}

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnDestroy, OnInit {

  strFullName: string;
  strUserID: string;
  private myEventSubscription: any;
  private myEventSubscription1: any;
  dtOptions: any;
  dtOptionsUOMT: any;
  dtTrigger: Subject<any> = new Subject<any>();

  uoms = [];
  uomts = [];
  ddlUOMs: any[];
  modalRef: BsModalRef;
  UOM_ID;
  UOM_Active: boolean;
  UOM_Active_ID: any;
  UOMT_ID;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;

  formInput2: FormInput2;
  form2: any;
  public isSubmit2: boolean;

  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) {
    this.isSubmit = false
      , this.isSubmit2 = false
  }

  ngOnInit() {
    // console.log("Ok")
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname')
    this.strFullName = fullname
    this.strUserID = userid
    this.pageLoad()

    // this.getUOMs()
    // this.getUOMsTest()

  }

  ngOnDestroy() {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }

    if (this.myEventSubscription1) {
      this.myEventSubscription1.unsubscribe();
    }

    // console.log("Detroy UOM")

  }

  pageLoad() {
    this.getUOMs();
  }

  getUOMs() {
    this.myEventSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/group/getGroups")
      .pipe(first())
      .subscribe(
        data => {
          //this.uoms = (data as any).data ;
          this.uoms = data['data'];
          // console.log(this.uoms)
          this.dtTrigger.next();
        },
        error => {
          //console.log(error);
        });


  }

  onNewUOM() {
    this.isSubmit = false
    this.formInput = {
      UOM_Name: ''
    };
    // this.formInput.UOM_Name = "555";
    this.UOM_Active = true;
  }

  async SaveUOM(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.modalRef.hide();
      // console.log("Save UOM")
      let json = {
        name: this.formInput.UOM_Name,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: parseInt(this.strUserID)
      }
      // console.log(JSON.stringify(json))
      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/group/addGroup", JSON.stringify(json))
        .pipe(first())
        .toPromise().then(
          data => {
            Swal.fire({
              text: "เพิ่มหมวดหมู่เรียบร้อยแล้ว",
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                // console.log("ngOnInit Again")
                this.ngOnInit();
              }
            });
          },
          error => {
            console.log(stringify(error))
            Swal.fire({
              text: "ไม่สามารถเพิ่มหมวดหมู่ได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
    }
  }

  async UpdateUOM(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.modalRef.hide();
      // console.log("Update UOM")
      let json = {
        id: parseInt(this.UOM_ID),
        name: this.formInput.UOM_Name,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: parseInt(this.strUserID)
      }
      // console.log(JSON.stringify(json))
      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/group/updateGroup", JSON.stringify(json))
        .pipe(first())
        .toPromise().then(
          data => {
            Swal.fire({
              text: "แก้ไขหมวดหมู่เรียบร้อยแล้ว",
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                // console.log("ngOnInit Again")
                this.ngOnInit();
              }
            });
          },
          error => {
            console.log(stringify(error))
            Swal.fire({
              text: "ไม่สามารถแก้ไขหมวดหมู่ได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
    }
  }

  DeleteAction(uom) {
    this.UOM_ID = uom.id

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบหมวดหมู่หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteUOM()
        Swal.fire(
          'Deleted!',
          'ลบหมวดหมู่เรียบร้อยแล้ว',
          'success'
        ).then((result1) => {
          if (result1.value) {
            // console.log("Go to ngOninit")
            this.ngOnInit()
          }
        })
      }
    })
  }

  async DeleteUOM() {
    var nextStep = false;
    // console.log("Delete UOM")
    let json = { id: parseInt(this.UOM_ID) }
    // this.modalRef.hide();
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/group/deleteGroup", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Delete UOM Success")
          nextStep = true;
        },
        error => {
          // var message = 'Service Check Exits ldap is unavailable'
          // if (error.error) {
          //   message = error.error.message
          // }
          // Swal.fire('Error', message, 'error');
        });

    return nextStep
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, uom) {
    console.log('editModal');

    this.isSubmit = false
    this.UOM_ID = uom.id;
    // console.log(uom.name)
    this.formInput = {
      UOM_Name: uom.name
    }
    this.UOM_Active = this.ConverInttoBool(uom.active)
    this.UOM_Active_ID = uom.active

    this.formInput2 = {
      UOMID_1: this.UOM_ID,
      Quantity_1: "",
      UOMID_2: "",
      Quantity_2: ""
    }
    // console.log(this.formInput2)
    // this.formInput2.UOMID_1 = this.UOM_ID;
    this.getddlUOMs()


    this.modalRef = this.modalService.show(template);

  }

  addUOMTModal(template: TemplateRef<any>) {
    this.UOMT_ID = "";
    this.isSubmit2 = false

    this.formInput2 = {
      UOMID_1: this.UOM_ID,
      Quantity_1: "",
      UOMID_2: "",
      Quantity_2: ""
    }

    this.modalRef = this.modalService.show(template);

  }

  getddlUOMs() {
    //confirm, unconfirm
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/ddlUOMs")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlUOMs = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  ConverBooltoInt(data: boolean) {
    if (data == true) {
      return 1
    } else {
      return 0
    }
  }

  ConverInttoBool(data: Number) {
    if (data == 1) {
      return true
    } else {
      return false
    }
  }


}
