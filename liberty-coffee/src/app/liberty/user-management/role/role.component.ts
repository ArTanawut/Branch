import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { environment } from 'src/environments/environment';

export class FormInput {
  RoleName: any
}

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  strFullName: string;
  strUserID: string;
  dtOptions: any;
  private RoleSubscription: any;
  roles = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  RoleId;
  // RoleName;
  idupdate;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;


  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname')
    this.strFullName = fullname
    this.strUserID = userid

    this.pageLoad()


  }

  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.RoleSubscription) {
      this.RoleSubscription.unsubscribe();
    }
  }

  pageLoad() {
    this.getRoles()

  }

  getRoles() {
    this.RoleSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/role/getRoles")
      .subscribe(
        data => {
          this.roles = data['data'];
          // console.log(this.roles)
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

  // getRoles1() {
  //   this.apiService.restApiGet(environment.apiLibertyUrl + "/role/getRoles")
  //     .subscribe(
  //       data => {
  //         this.roles = data['data'];

  //         // $(function () {
  //         //   $('data').DataTable();
  //         // });
  //         // console.log(this.ddlRole)
  //       },
  //       error => {
  //         //console.log(error);
  //       });
  // }



  onNewRole() {
    this.RoleId = "";
    this.formInput = {
      RoleName: ''
    }

    this.isSubmit = false

  }

  async SaveRole(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      this.modalRef.hide();
      // console.log(this.RoleId)
      this.idupdate = this.RoleId
      if (this.RoleId === "") {
        console.log("Save User")
        let json = {
          role_name: this.formInput.RoleName,
          user_action: this.strFullName,
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/role/addRole", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "เพิ่มกลุ่มผู้ใช้งานเรียบร้อยแล้ว",
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
                text: "ไม่สามารถเพิ่มกลุ่มผู้ใช้งานได้",
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
          role_name: this.formInput.RoleName,
          user_action: this.strFullName
        }
        // console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/role/updateRole", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขกลุ่มผู้ใช้งานเรียบร้อยแล้ว",
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
                text: "กรุณากรอกข้อมูลให้ครบถ้วน",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      }
    }
  }

  DeleteAction(role) {
    // console.log(role)
    this.RoleId = role.role_id;

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
        await this.deleteRole()
        // console.log("Run Step2")
        Swal.fire(
          'Deleted!',
          'ลบผู้ใช้งานเรียบร้อยแล้ว',
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

  async deleteRole() {
    // console.log("Delete Role")
    let json = { id: parseInt(this.RoleId) }
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/role/deleteRole", JSON.stringify(json))
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

    // this.modalRef.hide();
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, role) {
    this.RoleId = role.role_id
    this.formInput = {
      RoleName: role.role_name
    }
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


