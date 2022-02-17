import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { ApiService } from '../../services/api.service';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';


export class FormInput {
  firstname: any
  lastname: any
  username: any
  password: any
  roleId: any
  branchId: any
  activeFlag: any
}


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  strFullName: string;
  strUserID: string;
  dtRouterLinkOptions: any = {};
  allbranch;
  userlist: [];
  userDetail: [];
  testString;
  // name;
  // lastname;
  // username;
  // password;
  // roleId;
  // branchId;
  // activeFlag;
  id;
  idupdate;

  ddlRole: any[];
  ddlBranch: any[];

  modalRef: BsModalRef;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;



  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService) { }

  ngOnInit() {
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname')
    this.strFullName = fullname
    this.strUserID = userid

    this.pageLoad();

  }

  pageLoad() {
    this.getddlRole();
    this.getddlBranch();
    this.getUser();

    this.isSubmit = false
  }

  getUser() {
    this.apiService.restApiGet(environment.apiLibertyUrl + "/user/getUser")
      .subscribe(
        data => {
          this.userlist = data['data'];
          // console.log(this.userlist)
          // $(function () {
          //   $('data').DataTable();
          // });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  onNewUser() {
    this.id = "";
    this.formInput = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      roleId: '',
      branchId: '',
      activeFlag: '',
    }

    this.isSubmit = false

  }

  async SaveUser(form: any) {
    // console.log(this.id)
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.idupdate = this.id
      if (this.id === "") {
        console.log("Save User")
        let json = {
          firstname: this.formInput.firstname,
          lastname: this.formInput.lastname,
          username: this.formInput.username,
          password: this.formInput.password,
          role_id: parseInt(this.formInput.roleId),
          branch_id: parseInt(this.formInput.branchId),
          active_flag: parseInt(this.formInput.activeFlag),
          user_action: this.strFullName
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/user/users", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "เพิ่มผู้ใช้งานเรียบร้อยแล้ว",
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
                text: "ไม่สามารถเพิ่มผู้ใช้งานได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      } else {
        console.log("Update User")
        // console.log(this.idupdate)
        let json = {
          id: parseInt(this.idupdate),
          firstname: this.formInput.firstname,
          lastname: this.formInput.lastname,
          username: this.formInput.username,
          password: this.formInput.password,
          role_id: parseInt(this.formInput.roleId),
          branch_id: parseInt(this.formInput.branchId),
          active_flag: parseInt(this.formInput.activeFlag),
          user_action: this.strFullName
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/user/updateUser", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขผู้ใช้งานเรียบร้อยแล้ว",
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
                text: "ไม่สามารถแก้ไขผู้ใช้งานได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      }
      this.modalRef.hide()
    }
  }


  getddlRole() {
    //confirm, unconfirm
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/getRole")
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
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/getBranch")
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

    this.apiService.restApiSendParm(environment.apiLibertyUrl + "/user/getUserDetail", JSON.stringify(json))
      .subscribe(
        data => {
          this.userDetail = data['data'];
          console.log(this.userDetail)
          this.formInput = {
            firstname: data['data'][0].firstname,
            lastname: data['data'][0].lastname,
            username: data['data'][0].username,
            password: data['data'][0].password,
            roleId: data['data'][0].role_id,
            branchId: data['data'][0].branch_id,
            activeFlag: data['data'][0].active_flag
          }
          // console.log(data['data'][0].firstname)
          // $(function () {
          //   $('data').DataTable();
          // });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });



  }

  DeleteAction(user) {
    this.id = user.id;
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบผู้ใช้งานหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.deleteUser()
        // console.log("Run Step2")
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลสินค้าเรียบร้อยแล้ว',
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

  async deleteUser() {
    console.log("Delete User")
    let json = { id: parseInt(this.id) }
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/user/deleteUser", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Run Step1")
          // console.log("Delete UOMT Success")
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
          Swal.fire({
            text: "ไม่สามารถลบผู้ใช้งานได้",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });

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


}
