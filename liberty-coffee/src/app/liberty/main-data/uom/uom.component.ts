import { HttpClient } from '@angular/common/http';
import { Component, OnInit,OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
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
  private myEventSubscription: any;
  private myEventSubscription1: any;



  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    console.log("Ok")
    this.getUOMs()
    


  }

  getUOMs() {
    this.myEventSubscription = this.apiService.restApiGet("http://localhost:8080/uom/getUOMs")
      .subscribe(
        data => {
          //this.uoms = (data as any).data ;
          this.uoms = data['data'];
          // console.log(this.uoms)
          this.dtTrigger.next();

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

        
  }

  

  getRoles1() {
    this.apiService.restApiGet("http://localhost:8080/role/getRoles")
      .subscribe(
        data => {
          this.uoms = data['data'];

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  ngOnDestroy():void {
    // Do not forget to unsubscribe the event
    if(this.dtTrigger){
      this.dtTrigger.unsubscribe();
    }

    if(this.myEventSubscription){
      this.myEventSubscription.unsubscribe();
    }

    if(this.myEventSubscription1){
      this.myEventSubscription1.unsubscribe();
    }

    console.log("Destroy")
  }

  onNewUOM() {
    this.UOM_Name = "";
    this.UOM_Active = true;
  }

  SaveUOM() {
    // console.log(this.UOM_Name)
    // console.log(this.UOM_Active)
    // this.idupdate = this.RoleId
    // if (this.RoleId === "") {
      console.log("Save UOM")
      let json = {
        name: this.UOM_Name,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: "system",
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/uom/addUOM", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลหน่วยนับได้', 'error');
          });
  }

  UpdateUOM(){
    console.log("Update UOM")
      let json = {
        id:parseInt(this.UOM_ID),
        name: this.UOM_Name,
        active: this.ConverBooltoInt(this.UOM_Active),
        user: "system",
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/uom/updateUOM", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
              this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
          });
  }

  DeleteUOM() {
    console.log("Delete UOM")
    let json = { id: parseInt(this.UOM_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/uom/deleteUOM", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลหน่วยนับได้', 'error');
        });
  }

  getddlUOMs() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/ddlUOMs")
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

  ConverBooltoInt(data:boolean){
    if (data == true){
      return 1
    }else{
      return 0
    }
  }

  ConverInttoBool(data:Number){
    if (data == 1){
      return true
    }else{
      return false
    }
  }

  SaveUOMT() {
    // console.log(this.UOM_Name)
    console.log(this.UOMT_ID)
    if (this.UOMT_ID === "")
    {
      console.log("Save UOMT")
      // console.log(this.UOMT_ID)
      let json = {
        uom_id1: parseInt(this.UOMID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.UOMID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: 9,
      }
      // console.log(JSON.stringify(json))
      

      this.apiService.restApiSendParm("http://localhost:8080/uom/addUOMT", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
          });
          this.modalRef.hide();
    }else{
      console.log("Update UOMT")
      // console.log(this.UOMT_ID)
      let json = {
        id: parseInt(this.UOMT_ID),
        uom_id1: parseInt(this.UOMID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.UOMID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: 9,
      }
      // console.log(JSON.stringify(json))
      

      this.apiService.restApiSendParm("http://localhost:8080/uom/updateUOMT", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
          });
          this.modalRef.hide();
    }
    // this.idupdate = this.RoleId
    // if (this.RoleId === "") {
      //console.log("Save UOMT")
      
  }

  getUOMTs() {
    console.log("View UOMT")
    

      let json = {
        id: parseInt(this.UOM_ID)
      }

    this.myEventSubscription1 = this.apiService.restApiSendParm("http://localhost:8080/uom/getUOMTs", JSON.stringify(json))
      .subscribe(
        data => {
          this.uomts = data['data'];
          

          $(function () {
            $('data').DataTable({
              // paging: false,
              // searching: false
            });
          });

          this.dtTrigger.next();
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

        // this.ngOnDestroy();
  }

  DeleteUOMT() {
    console.log("Delete UOMT")
    let json = { id: parseInt(this.UOMT_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/uom/deleteUOMT", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
        });
  }

  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.UOM_Name = uom.name;
    this.UOM_Active = this.ConverInttoBool(uom.active)
    this.UOM_Active_ID = uom.active

    this.UOMID_1 = this.UOM_ID;
    this.getddlUOMs()   
      

    this.modalRef = this.modalService.show(template);

  }

  addUOMTModal(template: TemplateRef<any>) {
    this.UOMT_ID = "";
    this.Quantity_1 = "";
    this.UOMID_2 = "";
    this.Quantity_2 = "";

    this.modalRef = this.modalService.show(template);

  }

  viewUOMTModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.UOM_Name = uom.name;
    this.getUOMTs()

    this.getddlUOMs()   
    this.UOMID_1 = this.UOM_ID;
    console.log(this.UOM_ID)
    console.log(this.UOMID_1)

    this.modalRef = this.modalService.show(template);

  }

  editUOMTModal(template: TemplateRef<any>, uomts) {
    //this.getddlUOMs()   \    
    this.UOMT_ID = uomts.id;
    this.UOMID_1 = uomts.uom_id1;
    this.Quantity_1 = uomts.quantity1;
    this.UOMID_2 = uomts.uom_id2;
    this.Quantity_2 = uomts.quantity2;

    this.modalRef = this.modalService.show(template);

  }

  deleteModal(template: TemplateRef<any>, uom) {
    this.UOM_ID = uom.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  deleteModal1(template: TemplateRef<any>, uomt) {
    this.UOMT_ID = uomt.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  decline() {
    this.modalRef.hide();
  }

  btnColor() {
    document.getElementById('btn-yes').style.backgroundColor = '#00d0f1';
    document.getElementById('btn-yes').style.border = '1px solid #00d0f1';
    document.getElementById('btn-yes').style.color = '#fff';

    document.getElementById('btn-no').style.backgroundColor = '#fff';
    document.getElementById('btn-no').style.border = '1px solid #fff';
    document.getElementById('btn-no').style.color = '#000';
  }

  btnColorNo() {
    document.getElementById('btn-no').style.backgroundColor = '#00d0f1';
    document.getElementById('btn-no').style.border = '1px solid #00d0f1';
    document.getElementById('btn-no').style.color = '#fff';

    document.getElementById('btn-yes').style.backgroundColor = '#fff';
    document.getElementById('btn-yes').style.border = '1px solid #fff';
    document.getElementById('btn-yes').style.color = '#000';
  }

}
