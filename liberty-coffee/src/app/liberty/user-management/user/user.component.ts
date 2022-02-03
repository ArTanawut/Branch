import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { ApiService } from '../../services/api.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


class DataTablesResponse {
  data: any[];
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  dtRouterLinkOptions: any = {};
  allbranch;
  userlist: [];
  userDetail: [];
  testString;
  name;
  lastname;
  username;
  password;
  roleId;
  branchId;
  activeFlag;
  id;
  idupdate;

  ddlRole: any[];
  ddlBranch: any[];

  modalRef: BsModalRef;

  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getUser();

  }

  getUser() {
    this.apiService.restApiGet("http://localhost:8080/user/getUser")
      .subscribe(
        data => {
          this.userlist = data['data'];
          console.log(this.userlist)
          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  onNewUser() {
    this.id = "";
    this.name = "";
    this.lastname = "";
    this.username = "";
    this.password = "";
    this.getddlRole();
    this.getddlBranch();
    this.activeFlag = "";

  }

  SaveUser() {
    // console.log(this.id)
    this.idupdate = this.id
    if (this.id === "") {
      console.log("Save User")
      let json = {
        firstname: this.name,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        role_id: parseInt(this.roleId),
        branch_id: parseInt(this.branchId),
        active_flag: parseInt(this.activeFlag),
        user_action: "system",
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/user/users", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
              this.getUser();
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
        firstname: this.name,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        role_id: parseInt(this.roleId),
        branch_id: parseInt(this.branchId),
        active_flag: parseInt(this.activeFlag),
        user_action: "system",
      }
      console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/user/updateUser", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
              this.getUser();
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


  getddlRole() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/getRole")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlRole = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  getddlBranch() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/getBranch")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlBranch = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  viewUser() {
    console.log("View User")
    this.getddlRole();
    this.getddlBranch();
    let json = { id: parseInt(this.id) }
    console.log(JSON.stringify(json))

    this.apiService.restApiSendParm("http://localhost:8080/user/getUserDetail", JSON.stringify(json))
      .subscribe(
        data => {
          this.userDetail = data['data'];
          // console.log(data['data'][0].firstname)
          this.name = data['data'][0].firstname
          this.lastname = data['data'][0].lastname
          this.username = data['data'][0].username
          this.password = data['data'][0].password
          this.roleId = data['data'][0].role_id
          this.branchId = data['data'][0].branch_id
          this.activeFlag = data['data'][0].active_flag
          // $(function () {
          //   $('data').DataTable();
          // });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });



  }

  deleteUser() {
    console.log("Delete User")
    let json = { id: parseInt(this.id) }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/user/deleteUser", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบผู้ใช้งานเรียบร้อยแล้ว', '', 'success');
            this.getUser();
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

  decline() {
    this.modalRef.hide();
  }

  //======= Modal =======
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, user) {
    this.id = user.id;
    this.modalRef = this.modalService.show(template);
    this.viewUser()
  }

  deleteModal(template: TemplateRef<any>, user) {
    this.id = user.id;
    console.log(this.id)
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });

  }

  //======= End Modal =======

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
