import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { TextMaskModule } from 'angular2-text-mask';
import { NgNumberFormatterModule } from 'ng-number-formatter';
import { environment } from 'src/environments/environment'

export class FormInput {
  Branch_Name: any
  Time_Open: any
  Time_Close: any
}

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnDestroy, OnInit {
  RoleId: any;
  dtOptions: DataTables.Settings = {};
  branchs = [];
  Branch_ID: any;
  // Branch_Name: any;
  Address: any;
  // Time_Open: any;
  // Time_Close: any;
  chkActive: any;
  Active: boolean;
  Active_ID: any;
  public maskHour = [/\d/, /\d/, ':', /\d/, /\d/];

  dtOptionsUOMT: DataTables.Settings = {};
  uoms = [];
  uomts = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  UOM_ID;
  UOM_Name;
  UOM_Active: boolean;
  UOM_Active_ID: any;
  ddlUOMs: any[];
  UOMT_ID;
  UOMID_1;
  UOMID_2;
  Quantity_1;
  Quantity_2;
  private BranchSubscription: any;
  strRoleId: string;
  strUserID: string;
  strBranchId: string;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;



  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService,
    private textMask: TextMaskModule,
    private NgNumber: NgNumberFormatterModule
  ) { }

  ngOnInit() {
    var userid = localStorage.getItem('userid')
    var branchid = localStorage.getItem('branchid')
    var roleid = localStorage.getItem('roleid');

    this.strUserID = userid
    this.strBranchId = branchid
    this.RoleId = roleid

    this.pageLoad()
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.BranchSubscription) {
      this.BranchSubscription.unsubscribe();
    }

  }

  pageLoad() {
    this.getBranchs()
  }

  getBranchs() {
    this.BranchSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/shop/getBranch")
      .subscribe(
        data => {
          if (this.RoleId == "1") {
            //this.uoms = (data as any).data ;
            this.branchs = data['data'];
            // console.log(this.uoms)
            this.dtTrigger.next();

            // $(function () {
            //   $('data').DataTable();
            // });
          } else if (this.RoleId == "2") {
            this.branchs = data['data'];

            // console.log(this.RoleId)
            this.branchs = this.branchs.filter(data => data.id === this.strBranchId)
            // console.log(this.branchs)
            if (this.branchs.length > 0) {
              this.formInput = {
                Branch_Name: this.branchs[0].name,
                Time_Open: this.branchs[0].open_time,
                Time_Close: this.branchs[0].close_time
              }

              this.Branch_ID = this.branchs[0].id
              this.Address = this.branchs[0].address1
              this.UOM_Active = this.ConverInttoBool(this.branchs[0].active)
              this.UOM_Active_ID = this.branchs[0].active
              // this.newItemStock.barcode = this.data[index][0]
              // this.newItemStock.productId = this.BundleProductMap[0].id
              // this.newItemStock.productname = this.data[index][1]
              // this.newItemStock.quantity = this.data[index][7]
              // this.newItemStock.price = this.data[index][5]
              // this.newItemStock.total_price = this.data[index][11]
              // this.newItemStock.uom_id = this.BundleProductMap[0].uom_id
              // this.items.push(this.newItemStock);
              // this.newItemStock = {};
            }
          }



          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });


  }



  onNewBranch() {
    this.formInput = {
      Branch_Name: '',
      Time_Open: '',
      Time_Close: ''
    }

    this.Branch_ID = "";
    this.Address = "";
    this.UOM_Active = true;

    this.isSubmit = false
  }

  async SaveBranch(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      console.log("Save Branch")
      if (this.Branch_ID == "" || this.Branch_ID == undefined) {
        let json = {
          name: this.formInput.Branch_Name,
          address1: this.Address,
          open_time: this.formInput.Time_Open,
          close_time: this.formInput.Time_Close,
          active: this.ConverBooltoInt(this.UOM_Active),
          user: parseInt(this.strUserID),
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/shop/addBranch", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "เพิ่มข้อมูลสาขาเรียบร้อยแล้ว",
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
                text: "ไม่สามารถเพิ่มข้อมูลสาขาได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      } else {
        let json = {
          id: parseInt(this.Branch_ID),
          name: this.formInput.Branch_Name,
          address1: this.Address,
          open_time: this.formInput.Time_Open,
          close_time: this.formInput.Time_Close,
          active: this.ConverBooltoInt(this.UOM_Active),
          user: parseInt(this.strUserID),
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/shop/updateBranch", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขข้อมูลสาขาเรียบร้อยแล้ว",
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
                text: "ไม่สามารถแก้ไขข้อมูลสาขาได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      }
      if (this.RoleId == "1") {
        this.modalRef.hide()
      }
    }
  }

  DeleteAction(branch) {
    this.Branch_ID = branch.id;

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลสาขาหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteBranch()
        // console.log("Run Step2")
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลสาขาเรียบร้อยแล้ว',
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

  async DeleteBranch() {

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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  editModal(template: TemplateRef<any>, branch) {
    this.formInput = {
      Branch_Name: branch.name,
      Time_Open: branch.open_time,
      Time_Close: branch.close_time
    }

    this.Branch_ID = branch.id
    this.Address = branch.address1
    this.chkActive = branch.active
    this.Active = branch.active

    this.UOM_Active = this.ConverInttoBool(branch.active)
    this.UOM_Active_ID = branch.active

    // console.log(branch.active)


    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  addUOMTModal(template: TemplateRef<any>) {
    this.UOMT_ID = "";
    this.Quantity_1 = "";
    this.UOMID_2 = "";
    this.Quantity_2 = "";

    this.modalRef = this.modalService.show(template);

  }

  deleteModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

}


