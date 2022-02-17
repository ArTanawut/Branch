import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { async } from 'rxjs/internal/scheduler/async';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    // var dateuse = '0' + date.day
    // var monthuse = '0' + date.month
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'app-import-raw',
  templateUrl: './import-raw.component.html',
  styleUrls: ['./import-raw.component.scss'],
  providers: [

    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class ImportRawComponent implements OnInit {
  strFullName: string;
  strUserID: string;
  dtOptions: any;
  dtOptionsBundle: any;
  stocks = [];
  uomts = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  Product_ID;
  Product_Name;
  Product_Active: boolean;
  Product_Active_ID: any;
  ddlUOMs: any[];
  ddlRAWs: any[];
  Bundle_ID;
  ProductID_1;
  ProductID_2;
  Quantity_1;
  Quantity_2;
  RAW_ID;
  ProductType: any;
  private StockSubscription: any;
  private myEventSubscription1: any;
  items: Array<any> = [];
  newItemStock: any = {};
  item_raw_name: any;
  item_uom_id: any;
  item_uom_name: any;
  Barcode: any;
  UOM_ID: any;
  CheckAddBundle: any;

  item_raw_id: any;
  item_barcode: any;
  item_quantity: any;
  item_price: any;
  Stock_ID: any;
  doc_no: any;
  remark: any;
  chkDraft: any;

  toggle = false;
  model1: string;
  model2: string;

  // doc_date: any;
  linecount: any;
  doc_date: NgbDateStruct;




  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    // console.log("Ok")
    var userid = localStorage.getItem('userid');
    var fullname = localStorage.getItem('fullname')
    this.strFullName = fullname
    this.strUserID = userid

    this.pageLoad()

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.StockSubscription) {
      this.StockSubscription.unsubscribe();
    }

  }

  pageLoad() {
    this.getStocks()
    this.getddlUOMs()
    this.getddlRAWs()

  }

  getStocks() {
    let json = {
      type_id: 1
    }

    this.dtOptions = {
      order: [[0, 'desc']]
    };

    this.StockSubscription = this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/getStocks", JSON.stringify(json))
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.stocks = data['data'];
          // console.log(this.products)
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

  getddlUOMs() {
    //confirm, unconfirm
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/ddlUOMs")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlUOMs = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  getddlRAWs() {
    //confirm, unconfirm
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/ddlRAWs")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlRAWs = data['data'];
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  onNewProduct() {
    this.Stock_ID = "";
    this.doc_no = "";
    this.doc_date = null;
    this.remark = "";
    this.chkDraft = 1;
    this.items = [];
    this.newItemStock = {};

  }

  ConverBooltoInt(data: boolean) {
    if (data == true) {
      return 1
    } else {
      return 0
    }
  }

  ConverInttoBool(data: Number) {
    if (data == 1) {
      return true
    } else {
      return false
    }
  }

  SaveStockAction() {
    // console.log(this.doc_date)
    if (this.doc_date) {
      this.modalRef.hide();
      if (this.ConverBooltoInt(this.chkDraft == 0)) {
        // console.log(this.UOM_ID)
        Swal.fire({
          // title: 'Are you sure?',
          text: "ต้องการนำเข้าวัตถุดิบหรือไม่?",
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes'
        }).then((result) => {
          if (result.value) {
            this.SaveStock()
          }
        })
      } else {
        this.SaveStock()
      }
    } else {
      // console.log("OK")
      // Swal.fire({
      //   text: "กรุณาเลือกวันที่",
      //   icon: 'error',
      //   confirmButtonColor: '#3085d6',
      //   confirmButtonText: 'OK'
      // })

    }
  }

  async SaveStock() {
    console.log(this.Stock_ID)
    if (this.Stock_ID == "") { //Add Stock
      console.log("Save Stock")
      var dateuse = '0' + this.doc_date.day
      var monthuse = '0' + this.doc_date.month

      let json = {
        doc_date: this.doc_date.year.toString().slice(-2) + monthuse.slice(-2) + dateuse.slice(-2)
        // doc_date: "220201"
      }

      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/genDocNo", JSON.stringify(json))
        .toPromise().then(
          async response => {
            if (response) {
              let json = {
                doc_no: response['data'][0].new_docno,
                doc_date: this.doc_date.year.toString() + '-' + monthuse.slice(-2) + '-' + dateuse.slice(-2),
                //doc_date: "2021-02-01",
                type: 1,
                remarks: this.remark,
                draft: this.ConverBooltoInt(this.chkDraft),
                filename: "",
                user: parseInt(this.strUserID),
              }
              //console.log(JSON.stringify(json))
              await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/addStock", JSON.stringify(json))
                .toPromise().then(
                  async response1 => {
                    if (response1) {
                      await this.DeleteStockLine(response1['data'][0].stock_header_id);
                      // console.log("Step3")
                      await this.CalculateRemaining(response['data'][0].new_docno);
                      // console.log("Step5")
                      Swal.fire({
                        text: "เพิ่มข้อมูลนำเข้าวัตถุดิบเรียบร้อยแล้ว",
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      }).then((result) => {
                        if (result.value) {
                          // console.log("ngOnInit Again")
                          this.ngOnInit();
                        }
                      });
                      // Swal.fire('เพิ่มข้อมูลนำเข้าวัตถุดิบเรียบร้อยแล้ว', '', 'success');
                      // this.getProducts();
                    } else {
                      console.log(JSON.stringify(response1))
                      Swal.fire({
                        text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
                        icon: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'OK'
                      })
                    }
                  },
                  error => {
                    console.log(JSON.stringify(error))
                    Swal.fire({
                      text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
                      icon: 'error',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'OK'
                    })
                  });


            } else {
              console.log(JSON.stringify(response))
              Swal.fire({
                text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            }
          },
          error => {
            console.log(JSON.stringify(error))
            Swal.fire({
              text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
    } else {
      // console.log("Update Stock")
      // console.log(this.Bundle_ID)
      var dateuse = '0' + this.doc_date.day
      var monthuse = '0' + this.doc_date.month
      let json = {
        id: this.Stock_ID,
        doc_no: this.doc_no,
        doc_date: this.doc_date.year.toString().slice(-2) + monthuse.slice(-2) + dateuse.slice(-2),
        type: 1,
        remarks: this.remark,
        draft: this.ConverBooltoInt(this.chkDraft),
        filename: "",
        user: parseInt(this.strUserID),
      }
      // console.log(JSON.stringify(json))

      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/updateStock", JSON.stringify(json))
        .toPromise().then(
          async response => {
            if (response) {
              await this.DeleteStockLine(this.Stock_ID);
              await this.CalculateRemaining(this.doc_no);
              Swal.fire({
                text: "แก้ไขข้อมูลนำเข้าวัตถุดิบเรียบร้อยแล้ว",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  // console.log("ngOnInit Again")
                  this.ngOnInit();
                }
              });
            } else {
              console.log(JSON.stringify(response))
              Swal.fire({
                text: "ไม่สามารถแก้ไขข้อมูลนำเข้าวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            }
          },
          error => {
            console.log(JSON.stringify(error))
            Swal.fire({
              text: "ไม่สามารถแก้ไขข้อมูลนำเข้าวัตถุดิบได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
      this.modalRef.hide();
    }
  }

  async DeleteStockLine(stock_header_id: string) {
    console.log(stock_header_id)
    console.log("Delete StockLine")
    let json = {
      id: parseInt(stock_header_id)
    }

    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/deleteStockLine", JSON.stringify(json))
      .toPromise().then(
        async response => {
          if (response) {
            // console.log("Step1")
            await this.AddStockLine(stock_header_id)
            // this.getProducts();
          } else {
            // console.log("Login Fail")
            console.log(JSON.stringify(response))
            Swal.fire({
              text: "ไม่สามารถลบข้อมูลได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          }
        },
        error => {
          console.log(JSON.stringify(error))
          Swal.fire({
            text: "ไม่สามารถลบข้อมูลได้",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });
  }

  async AddStockLine(stock_header_id: string) {
    console.log(stock_header_id)
    console.log("Add Stock Line")
    for (let i = 0; i < this.items.length; i++) {
      // console.log("Loop :" + i)
      let json = {
        stock_header_id: parseInt(stock_header_id),
        raw_material_id: parseInt(this.items[i].raw_material_id),
        barcode: this.items[i].barcode,
        uom_id: parseInt(this.items[i].uom_id),
        quantity: parseFloat(this.items[i].quantity),
        price: parseFloat(this.items[i].price),
      }

      console.log(JSON.stringify(json))
      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/addStockLine", JSON.stringify(json))
        .toPromise().then(
          response => {
            if (response) {
              // console.log("Step2")
              // this.getProducts();
            } else {
              console.log(JSON.stringify(response))
              Swal.fire({
                text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            }
          },
          error => {
            console.log(JSON.stringify(error))
            Swal.fire({
              text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
    }
  }

  DeleteAction(stock) {
    this.Stock_ID = stock.id;

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลการนำเข้าวัตถุดิบหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteStock()
        // console.log("Run Step2")
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลการนำเข้าวัตถุดิบเรียบร้อยแล้ว',
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

  async DeleteStock() {
    console.log("Delete Stock")
    let json = { id: parseInt(this.Stock_ID) }
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/deleteStock", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Run Step1")
          // console.log("Delete UOMT Success")
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
          Swal.fire({
            text: "ไม่สามารถลบข้อมูลการนำเข้าวัตถุดิบได้",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });

    // this.modalRef.hide();
  }

  getStockLines() {
    console.log("View Stock Lines")

    let json = {
      id: parseInt(this.Stock_ID)
    }
    console.log(JSON.stringify(json))

    this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/getStockLine", JSON.stringify(json))
      .subscribe(
        data => {
          this.items = data['data'];

          // $(function () {
          //   $('data').DataTable({
          //     // paging: false,
          //     // searching: false
          //   });
          // });

          this.dtTrigger.next();
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

    // this.ngOnDestroy();
  }

  async CalculateRemaining(p_doc_no: string) {
    // console.log(sale_header_id)
    console.log("Start CalculateRemaining")
    console.log("doc_no :" + p_doc_no)
    let json = {
      doc_no: p_doc_no
    }

    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/stock/calculateStockRemaining", JSON.stringify(json))
      .toPromise().then(
        response => {
          if (response) {
            // console.log("Step4")
            // Swal.fire('เพิ่มข้อมูลนำเข้าวัตถุดิบเรียบร้อยแล้ว', '', 'success');
            // this.getProducts();
          } else {
            console.log(JSON.stringify(response))
            Swal.fire({
              text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          }
        },
        error => {
          console.log(JSON.stringify(error))
          Swal.fire({
            text: "ไม่สามารถเพิ่มข้อมูลนำเข้าวัตถุดิบได้",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
        });
    console.log("End CalculateRemaining")
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  editModal(template: TemplateRef<any>, stock) {
    this.Stock_ID = stock.id
    this.doc_no = stock.doc_no
    // this.doc_date = stock.doc_date
    const dateUse = stock.doc_date.split('/');
    this.doc_date = { day: parseInt(dateUse[0], 10), month: parseInt(dateUse[1], 10), year: parseInt(dateUse[2], 10) };
    console.log(this.doc_date)

    this.remark = stock.remarks
    this.chkDraft = stock.draft

    this.getStockLines();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  viewLineModal(template: TemplateRef<any>, stock) {
    this.Stock_ID = stock.id
    this.linecount = stock.record
    this.dtTrigger = new Subject<any>();
    this.getStockLines();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  addItems() {
    this.newItemStock.raw_material_id = this.item_raw_id;
    this.newItemStock.raw_material_name = this.item_raw_name;
    this.newItemStock.uom_id = this.item_uom_id;
    this.newItemStock.uom_name = this.item_uom_name;
    this.items.push(this.newItemStock);
    console.log(this.items);
    this.newItemStock = {};
  }

  removeItem(index) {
    this.items.splice(index, 1); // remove 1 item at ith place
  }

  onChange(raw) {
    // console.log(deviceValue)
    if (raw != "") {
      for (let i = 0; i < this.ddlRAWs.length; i++) {
        if (raw == this.ddlRAWs[i].raw_id) {
          this.item_raw_name = this.ddlRAWs[i].raw_name
          this.item_raw_id = this.ddlRAWs[i].raw_id
        }
      }
    }
    // this.item_raw_name = deviceValue[0].raw_name;
  }

  onChangeUOM(uom) {
    // console.log(deviceValue)
    if (uom != "") {
      for (let i = 0; i < this.ddlUOMs.length; i++) {
        if (uom == this.ddlUOMs[i].uom_id) {
          this.item_uom_name = this.ddlUOMs[i].uom_name
          this.item_uom_id = this.ddlUOMs[i].uom_id
        }
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;

  }

}