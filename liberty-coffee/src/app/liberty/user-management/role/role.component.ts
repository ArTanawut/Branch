import { HttpClient } from '@angular/common/http';
import { Component, OnInit,TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  roles = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  RoleId;
  RoleName;
  idupdate;


  constructor(private http : HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
    ) { }

  ngOnInit() {
    this.getRoles()   

    
  }

  getRoles() {
    this.apiService.restApiGet("http://localhost:8080/role/getRoles")
      .subscribe(
        data => {
          this.roles = data['data'];
          console.log(this.roles)
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
          this.roles = data['data'];

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  onNewRole() {
    this.RoleId = "";
    this.RoleName = "";

  }

  SaveRole() {
    console.log(this.RoleId)
    this.idupdate = this.RoleId
    if (this.RoleId === "") {
      console.log("Save User")
      let json = {
        role_name: this.RoleName,
        user_action: "system",
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/role/addRole", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มกลุ่มผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
              this.getRoles1();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
          });
    } else {
      console.log("Update User")
      // console.log(this.idupdate)
      let json = {
        id: parseInt(this.idupdate),
        role_name: this.RoleName,
        user_action: "system",
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/role/updateRole", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขกลุ่มผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
              this.getRoles1();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
          });
    }

  }

  deleteRole() {
    console.log("Delete Role")
    let json = { id: parseInt(this.RoleId) }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/role/deleteRole", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
            this.getRoles1();
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบผู้ใช้งานได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบผู้ใช้งานได้', 'error');
        });

    this.modalRef.hide();
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
 }

  editModal(template: TemplateRef<any>, role) {
    this.RoleId = role.role_id;
    this.RoleName = role.role_name
    // console.log(role.role_id)
    // console.log(role.role_name)
    this.modalRef = this.modalService.show(template);
    
  }

 deleteModal(template: TemplateRef<any>, person) {
  this.RoleId = person.role_id;
  console.log(this.RoleId)
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


