import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../../liberty/services/api.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username;
  password;
  form2: FormGroup;

  constructor(private router: Router, private http: HttpClient, private apiService: ApiService,) {
    this.form2 = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit(): void {
  }

  public onSubmit(value) {
    // console.log(JSON.stringify(value));
  }

  public onLogin(value) {
    // console.log('OK')
    // let json = { username: this.username, password: this.password }
    this.apiService.restApiSendParm("http://localhost:8080/share/login", JSON.stringify(value))
      .subscribe(
        response => {
          // console.log(response)
          if (response) {

            const userId = response['data'][0].userid;
            const fullName = response['data'][0].firstname + " " + response['data'][0].lastname;
            const roleId = response['data'][0].role_id;
            const branchId = response['data'][0].branch_id;

            localStorage.setItem('userid', userId);
            localStorage.setItem('fullname', fullName);
            localStorage.setItem('roleid', roleId);
            localStorage.setItem('branchid', branchId);
            localStorage.setItem('timeout', "600000");
            // console.log("Login Ok")
            Swal.fire('Log in Success', '', 'success');
            this.router.navigateByUrl('/dashboard')
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'Username or Password incorrect', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'Username or Password incorrect', 'error');
        });

  }

}
