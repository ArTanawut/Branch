import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  strUserID: string;
  strFullName: string;
  strRoleId: string;
  strBranchId: string;
  constructor() { }

  ngOnInit(): void {
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname');
    var roleid = localStorage.getItem('roleid');
    var branchid = localStorage.getItem('branchid');
    this.strUserID = userid
    this.strFullName = fullname
    this.strRoleId = roleid
    this.strBranchId = branchid
  }

}
