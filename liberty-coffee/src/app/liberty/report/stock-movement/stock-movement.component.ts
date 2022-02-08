import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-stock-movement',
  templateUrl: './stock-movement.component.html',
  styleUrls: ['./stock-movement.component.scss'],
  providers: [

    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})

export class StockMovementComponent implements OnInit {

  dtOptions: any = {};
  dtOptionFulls: any = {};
  dtOptionsBundle: DataTables.Settings = {};
  stocks = [];
  stocksfull = [];
  uomts = [];
  modalRef: BsModalRef;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject();

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
  private myEventSubscription: any;
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
  start_date: NgbDateStruct;
  end_date: NgbDateStruct;
  chkSearch: any;
  TypeReport: any;




  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.chkSearch = 0
    this.TypeReport = "2"
    // if (this.TypeReport == "1") {
    //   this.getReportStocks()
    // } else if (this.TypeReport == "2") {
    //   this.getReportStocksFull()
    // }

    this.getReportStocks()
    this.getReportStocksFull()

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.dtTrigger2) {
      this.dtTrigger2.unsubscribe();
    }

    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }

    if (this.myEventSubscription1) {
      this.myEventSubscription1.unsubscribe();
    }

    console.log("Destroy")
  }

  getReportStocks() {
    this.chkSearch = 1
    let json = {
      start_date: "2022-02-02",
      end_date: "2022-02-10"
    }

    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'excel'
      ]
    };

    this.myEventSubscription = this.apiService.restApiSendParm("http://localhost:8080/report/getReportStocks", JSON.stringify(json))
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.stocks = data['data'];
          // console.log(this.products)
          this.dtTrigger.next();

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });


  }

  getReportStocksFull() {
    this.chkSearch = 1
    let json = {
      start_date: "2022-02-02",
      end_date: "2022-02-05"
    }

    this.dtOptionFulls = {
      dom: 'Bfrtip',
      buttons: [
        'excel'
      ]
    };

    this.myEventSubscription1 = this.apiService.restApiSendParm("http://localhost:8080/report/getReportStocksFull", JSON.stringify(json))
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.stocksfull = data['data'];
          // console.log(this.products)
          this.dtTrigger2.next();

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });


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

  getStockLines() {
    console.log("View Stock Lines")

    let json = {
      id: parseInt(this.Stock_ID)
    }
    console.log(JSON.stringify(json))

    this.apiService.restApiSendParm("http://localhost:8080/stock/getStockLine", JSON.stringify(json))
      .subscribe(
        data => {
          this.items = data['data'];

          $(function () {
            $('data').DataTable({
              // paging: false,
              // searching: false
            });
          });

          this.dtTrigger.next();
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

    // this.ngOnDestroy();
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
    // this.doc_date = { day: parseInt(dateUse[0], 10), month: parseInt(dateUse[1], 10), year: parseInt(dateUse[2], 10) };
    // console.log(this.doc_date)

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
    this.getStockLines();

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  deleteModal(template: TemplateRef<any>, product) {
    this.Product_ID = product.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }


  decline() {
    this.modalRef.hide();
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
