import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../../liberty/services/api.service';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient, private apiService: ApiService,) {
    this.form2 = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  username;
  password;
  form2: FormGroup;

  ngOnInit(): void {
  }

  public onSubmit(value) {
    // console.log(JSON.stringify(value));
  }

  async onLogin(value) {
    // console.log('OK')
    // let json = { username: this.username, password: this.password }
    await this.TestServer()

    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/share/login", JSON.stringify(value))
      .toPromise().then(
        response => {
          if (response) {
            const userId = response['data'][0].userid;
            const fullName = response['data'][0].firstname + " " + response['data'][0].lastname;
            const roleId = response['data'][0].role_id;
            const branchId = response['data'][0].branch_id;

            localStorage.setItem('userid', userId);
            localStorage.setItem('fullname', fullName);
            localStorage.setItem('roleid', roleId);
            localStorage.setItem('branchid', branchId);
            // localStorage.setItem('timeout', "600000");
            // console.log("Login Ok")
            // Swal.fire('Log in Success', '', 'success');
            this.router.navigateByUrl('/dashboard')
          } else {
            // console.log("Login Fail")
            Swal.fire({
              text: "Username or Password incorrect",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          }

        },
        error => {
          // console.log(stringify(error))
          Swal.fire({
            text: "Username or Password incorrect",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });
  }

  async TestServer() {
    var checkServer = 0
    for (let i = 1; i <= 5; i++) {
      if (checkServer == 0) {
        await this.apiService.restApiGet(environment.apiLibertyUrl + "/share/getRole")
          .toPromise().then(
            response => {
              if (response) {
                checkServer = 1
                console.log("Test Server " + i + " Success")
              }
            },
            error => {
              console.log("Test Server " + i + " Fail")
            });
      }
    }
  }
}
