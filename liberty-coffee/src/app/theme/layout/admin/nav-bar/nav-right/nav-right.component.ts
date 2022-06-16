import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../../liberty/services/api.service';
import { environment } from 'src/environments/environment';
import { async } from 'rxjs/internal/scheduler/async';

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
  notification: any[];
  numberNotification: any;
  dateNotification: any;

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

    this.getNotification()


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

  async getNotification() {
    //confirm, unconfirm
    await this.apiService.restApiGet(environment.apiLibertyUrl + "/share/getNotifications")
      .toPromise().then(
        async data => {
          this.notification = data['data'];
          this.dateNotification = this.notification[0].notification_date
          this.numberNotification = await this.CheckNumberNoti()
        },
        error => {
          console.log(JSON.stringify(error))
        });


  }

  onRead() {
    this.numberNotification = ""
    this.apiService.restApiPost(environment.apiLibertyUrl + "/share/updateReadNotification")
      .subscribe(
        data => {

        },
        error => {
          //console.log(error);
        });
  }

  async CheckNumberNoti() {
    this.numberNotification = 0
    for (let i = 0; i < this.notification.length; i++) {
      if (this.notification[i].read_flag == "0") {
        if (this.numberNotification == 0) {
          this.numberNotification = 1
        } else {
          this.numberNotification = this.numberNotification + 1
        }
      }
    }

    if (this.numberNotification == 0) {
      this.numberNotification = ""
    }

    return this.numberNotification
  }


}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}