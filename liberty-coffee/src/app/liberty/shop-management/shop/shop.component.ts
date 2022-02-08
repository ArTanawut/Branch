import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { TextMaskModule } from 'angular2-text-mask';
import { NgNumberFormatterModule } from 'ng-number-formatter';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  Shop_Id: any;
  Shop_Name: any;
  Shop_Detail: any;
  Time_Open: any;
  Time_Close: any;
  public maskHour = [/\d/, /\d/, ':', /\d/, /\d/];
  Shop = [];
  private myEventSubscription: any;
  dtTrigger: Subject<any> = new Subject<any>();
  strUserID: string;
  strBranchId: string;


  constructor(private textMask: TextMaskModule,
    private NgNumber: NgNumberFormatterModule,
    private http: HttpClient,
    private apiService: ApiService) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('userid')
    var branchid = localStorage.getItem('branchid')
    this.strUserID = userid
    this.strBranchId = branchid

    this.getShop()
  }


  getShop() {
    this.myEventSubscription = this.apiService.restApiGet("http://localhost:8080/shop/getShop")
      .subscribe(
        data => {
          this.Shop = data['data'];
          console.log(this.Shop.length)

          if (this.Shop.length > 0) {
            this.Shop_Id = this.Shop[0].id;
            this.Shop_Name = this.Shop[0].name;
            this.Shop_Detail = this.Shop[0].description;
            this.Time_Open = this.Shop[0].open_time;
            this.Time_Close = this.Shop[0].close_time;
          }
        },
        error => {
          //console.log(error);
          var msgerr = 'Service unavailable';
          if (typeof error.error === 'string' || error.error instanceof String)
            msgerr = error.error != null ? error.error : error.message;
          Swal.fire('Error', msgerr, 'error');
        });


  }

  saveShop() {
    console.log("Save Shop")
    // console.log(this.Shop_Id)
    if (this.Shop_Id == "" || this.Shop_Id == undefined) {
      let json = {
        name: this.Shop_Name,
        description: this.Shop_Detail,
        open_time: this.Time_Open,
        close_time: this.Time_Close,
        user: parseInt(this.strUserID)
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/shop/addShop", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถบันทึกข้อมูลร้านค้าได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถบันทึกข้อมูลร้านค้าได้', 'error');
          });
    } else {
      let json = {
        id: parseInt(this.Shop_Id),
        name: this.Shop_Name,
        description: this.Shop_Detail,
        open_time: this.Time_Open,
        close_time: this.Time_Close,
        user: parseInt(this.strUserID)
      }
      // console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/shop/updateShop", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว', '', 'success');
              // this.getUOMs();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถบันทึกข้อมูลร้านค้าได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถบันทึกข้อมูลร้านค้าได้', 'error');
          });
    }

  }

}