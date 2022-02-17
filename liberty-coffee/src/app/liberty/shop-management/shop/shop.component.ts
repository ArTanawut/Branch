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
import { environment } from 'src/environments/environment'

export class FormInput {
  Shop_Name: any
  Time_Open: any
  Time_Close: any
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  Shop_Id: any;
  // Shop_Name: any;
  Shop_Detail: any;
  // Time_Open: any;
  // Time_Close: any;
  public maskHour = [/\d/, /\d/, ':', /\d/, /\d/];
  Shop = [];
  private myEventSubscription: any;
  dtTrigger: Subject<any> = new Subject<any>();
  strUserID: string;
  strBranchId: string;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;


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

    this.isSubmit = false
  }


  getShop() {
    this.myEventSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/shop/getShop")
      .subscribe(
        data => {
          this.Shop = data['data'];
          console.log(this.Shop.length)

          if (this.Shop.length > 0) {
            this.formInput = {
              Shop_Name: this.Shop[0].name,
              Time_Open: this.Shop[0].open_time,
              Time_Close: this.Shop[0].close_time
            }

            this.Shop_Id = this.Shop[0].id;
            this.Shop_Detail = this.Shop[0].description;

            // this.formInput.Shop_Name = this.Shop[0].name;
            // this.formInput.Time_Open = this.Shop[0].open_time;
            // this.formInput.Time_Close = this.Shop[0].close_time;
          }
        },
        error => {
          console.log(JSON.stringify(error))
          Swal.fire({
            text: "Service unavailable",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });


  }

  saveShop(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      console.log("Save Shop")
      // console.log(this.Shop_Id)
      if (this.Shop_Id == "" || this.Shop_Id == undefined) {
        let json = {
          name: this.formInput.Shop_Name,
          description: this.Shop_Detail,
          open_time: this.formInput.Time_Open,
          close_time: this.formInput.Time_Close,
          user: parseInt(this.strUserID)
        }
        // console.log(JSON.stringify(json))
        this.apiService.restApiSendParm(environment.apiLibertyUrl + "/shop/addShop", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                Swal.fire({
                  text: "บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว",
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
                // this.getUOMs();
              } else {
                console.log(JSON.stringify(response))
                Swal.fire({
                  text: "ไม่สามารถบันทึกข้อมูลร้านค้าได้",
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
              }
            },
            error => {
              // console.log(error)
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถบันทึกข้อมูลร้านค้าได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      } else {
        let json = {
          id: parseInt(this.Shop_Id),
          name: this.formInput.Shop_Name,
          description: this.Shop_Detail,
          open_time: this.formInput.Time_Open,
          close_time: this.formInput.Time_Close,
          user: parseInt(this.strUserID)
        }
        // console.log(JSON.stringify(json))
        this.apiService.restApiSendParm(environment.apiLibertyUrl + "/shop/updateShop", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                Swal.fire({
                  text: "บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว",
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
                // this.getUOMs();
              } else {
                console.log(JSON.stringify(response))
                Swal.fire({
                  text: "ไม่สามารถบันทึกข้อมูลร้านค้าได้",
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
              }
            },
            error => {
              // console.log(error)
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถบันทึกข้อมูลร้านค้าได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
      }
    }


  }

}