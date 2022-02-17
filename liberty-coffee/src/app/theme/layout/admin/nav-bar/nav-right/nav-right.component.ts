import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../liberty/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavRightComponent implements OnInit {
  strFullName: string;
  strRoleId: any;
  branchId: any;
  ddlBranch: any[];

  constructor(private router: Router, private http: HttpClient,
    private apiService: ApiService) { }

  ngOnInit() {
    var fullname = localStorage.getItem('fullname');
    var roleid = localStorage.getItem('roleid');
    var branchid = localStorage.getItem('branchid');
    this.strFullName = fullname
    this.strRoleId = parseInt(roleid)
    this.branchId = branchid

    if (this.strRoleId == "1") {
      this.getddlBranch()
    }


  }

  onLogOut() {
    this.router.navigateByUrl('/login')
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

  onOptionsSelected(value: string) {
    localStorage.setItem('branchid', value);
    window.location.reload();
    // console.log("the selected value is " + value);
  }

}
