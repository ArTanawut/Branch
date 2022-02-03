import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../../../liberty/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username;
  password;

  constructor(private router:Router,private http:HttpClient,private apiService: ApiService) { }

  ngOnInit(): void {
  }

  onLogin(){
    // console.log('OK')
    let json = { username : this.username, password : this.password}
    this.apiService.restApiSendParm("http://localhost:8080/share/login",JSON.stringify(json))
      .subscribe(
        response => {
          // console.log(response)
        if (response){
          // console.log("Login Ok")
          Swal.fire('Log in Success', '', 'success');
          this.router.navigateByUrl('/dashboard')
        }else{
          // console.log("Login Fail")
          Swal.fire('', 'Username or Password incorrect', 'error');
        }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'Username or Password incorrect', 'error');
        });

    // this.http.post('http://localhost:8080/share/login',JSON.stringify(json),{ headers: headers})
    //   .subscribe(response =>{
    //     console.log(response)
    //     if (response){
    //       console.log("Login Ok")
    //       Swal.fire('Log in Success', '', 'success');
    //       this.router.navigateByUrl('/dashboard')
    //     }else{
    //       console.log("Login Fail")
    //       Swal.fire('', 'Username or Password incorrect', 'error');
    //     }

    //   }, error => {
    //     console.log(error)
    //     Swal.fire('', 'Username or Password incorrect', 'error');
    //   })
      
    // Swal.fire('Log in Success', '', 'success');
    // Swal.fire('', 'Username or Password incorrect', 'error');
    // this.router.navigateByUrl('/dashboard')
  }

}
