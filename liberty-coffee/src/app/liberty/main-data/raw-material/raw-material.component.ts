import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';

export class FormInput {
  RAW_Name: any
  Remaining_qty: any
  UOM_ID: any
}

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss']
})
export class RawMaterialComponent implements OnDestroy, OnInit {
  strFullName: string;
  strUserID: string;
  private RawSubscription: any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  raws = [];
  ddlUOMs: any[];
  modalRef: BsModalRef;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;

  raw_id: any;
  Barcode: any;
  RAW_Active: boolean;
  RAW_ID: any;
  RAW_Active_ID: any;
  UOM_Name: any;


  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    // console.log("Ok")
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname')
    this.strFullName = fullname
    this.strUserID = userid

    this.pageLoad()


  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.RawSubscription) {
      this.RawSubscription.unsubscribe();
    }

    // console.log("Destroy")
  }

  pageLoad() {
    this.getRAWs()
    this.getddlUOMs()

    this.formInput = {
      RAW_Name: '',
      Remaining_qty: '',
      UOM_ID: ''
    }

    this.RAW_ID = ""
    this.UOM_Name = ""
    this.RAW_Active = true
    this.isSubmit = false
  }

  getRAWs() {
    this.RawSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/raw/getRaws")
      .subscribe(
        data => {
          //this.uoms = (data as any).data ;
          this.raws = data['data'];
          // console.log(this.uoms)
          this.dtTrigger.next();

          // $(function () {
          //   $('data').DataTable();
          // });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  onNewRAW() {
    this.formInput = {
      RAW_Name: '',
      Remaining_qty: '',
      UOM_ID: ''
    }

    this.RAW_ID = ""
    this.UOM_Name = ""
    this.Barcode = ""
    this.RAW_Active = true
    this.isSubmit = false
  }

  async SaveRAW(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      // console.log(this.RAW_ID)
      // console.log(this.UOM_Active)
      // this.idupdate = this.RoleId
      if (this.RAW_ID === "") {
        // console.log("Save RAW")
        let json = {
          barcode: this.Barcode,
          name: this.formInput.RAW_Name,
          uom_id: parseInt(this.formInput.UOM_ID),
          remaining_qty: parseFloat(this.formInput.Remaining_qty),
          active: this.ConverBooltoInt(this.RAW_Active),
          user: parseInt(this.strUserID),
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/addRaw", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "เพิ่มข้อมูลวัตถุดิบเรียบร้อยแล้ว",
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
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });

        this.modalRef.hide()
      } else {
        // console.log("Update RAW")
        let json = {
          id: parseInt(this.RAW_ID),
          barcode: this.Barcode,
          name: this.formInput.RAW_Name,
          uom_id: parseInt(this.formInput.UOM_ID),
          remaining_qty: parseFloat(this.formInput.Remaining_qty),
          active: this.ConverBooltoInt(this.RAW_Active),
          user: parseInt(this.strUserID),
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/updateRaw", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขข้อมูลวัตถุดิบเรียบร้อยแล้ว",
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
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถแก้ไขข้อมูลวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });

        this.modalRef.hide()
      }
    }

  }

  DeleteAction(raw) {
    this.RAW_ID = raw.id

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลวัตถุดิบหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteRAW()
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลวัตถุดิบเรียบร้อยแล้ว',
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

  async DeleteRAW() {
    let json = { id: parseInt(this.RAW_ID) }
    // this.modalRef.hide();
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/deleteRaw", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Delete UOMT Success")
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
        });

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, raw) {
    // this.getddlUOMs()   
    this.RAW_ID = raw.id;
    this.Barcode = raw.barcode;
    this.formInput.RAW_Name = raw.name;
    this.formInput.Remaining_qty = parseFloat(raw.remaining_qty);
    this.formInput.UOM_ID = parseInt(raw.uom_id);

    this.RAW_Active = this.ConverInttoBool(raw.active)
    this.RAW_Active_ID = raw.active

    this.modalRef = this.modalService.show(template);

  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;

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
