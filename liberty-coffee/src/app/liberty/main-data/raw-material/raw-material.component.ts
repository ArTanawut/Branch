import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { async } from 'rxjs/internal/scheduler/async';
import { json } from 'ngx-custom-validators/src/app/json/validator';
const { read, write, utils } = XLSX;

type AOA = any[][];

export class FormInput {
  RAW_Name: any
  Remaining_qty: any
  UOM_ID: any
  Raw_Group: any
  Min_stock: any
  Max_stock: any
  Price: any
  Percent_Loss: any
}

export class FormInput2 {
  UOMID_1: any
  Quantity_1: any
  UOMID_2: any
  Quantity_2: any
}

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.scss']
})
export class RawMaterialComponent implements OnDestroy, OnInit {
  strFullName: string;
  strUserID: string;
  private RawSubscription: any;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  raws = [];
  ddlUOMs: any[];
  ddlGroups: any[];
  ddlROUMT: any[];
  modalRef: BsModalRef;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;

  formInput2: FormInput2;
  form2: any;
  public isSubmit2: boolean;

  raw_id: any;
  Barcode: any;
  RAW_Active: boolean;
  RAW_ID: any;
  RAW_Active_ID: any;
  UOM_Name: any;
  uomid: any;
  UOMT_ID: any;

  linecount: any;
  Filename: any;
  items: Array<any> = [];
  newItemStock: any = {};
  BundleProductList: any[];
  BundleProductMap: any[]


  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };


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

    if (this.RawSubscription) {
      this.RawSubscription.unsubscribe();
    }

    // console.log("Destroy")
  }

  pageLoad() {
    this.getRAWs()
    this.getddlUOMs()
    this.getddlGroups()

    // this.formInput = {
    //   RAW_Name: '',
    //   Remaining_qty: '',
    //   UOM_ID: ''
    // }

    // this.RAW_ID = ""
    // this.UOM_Name = ""
    // this.RAW_Active = true
    // this.isSubmit = false

  }

  getRAWs() {
    this.RawSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/raw/getRaws")
      .subscribe(
        data => {
          //this.uoms = (data as any).data ;
          this.raws = data['data'];
          // console.log(this.uoms)
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

  onNewRAW() {
    this.formInput = {
      RAW_Name: '',
      Remaining_qty: '',
      UOM_ID: '',
      Raw_Group: '',
      Min_stock: '',
      Max_stock: '',
      Price: '',
      Percent_Loss: ''
    }

    this.RAW_ID = ""
    this.UOM_Name = ""
    this.Barcode = ""
    this.RAW_Active = true
    this.isSubmit = false

    this.items = [];
    this.newItemStock = {};
  }

  async SaveRAW(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      // console.log(this.RAW_ID)
      // console.log(this.UOM_Active)
      // this.idupdate = this.RoleId
      if (this.RAW_ID === "") {
        // console.log("Save RAW")
        // const  chkBarcodeExist :Int32Array
        var chkBarcodeExist = await this.CheckBarcodeExist(this.Barcode)
        if (chkBarcodeExist == 1) {
          // Swal.fire({ icon: 'error', title: '', showConfirmButton: false });
          // $('.swal2-container').css("z-index", '999999');
          Swal.fire({
            text: "ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้ เนื่องจาก Barcode ซ้ำ",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
          $('.swal2-container').css("z-index", '999999');
        } else {
          let json = {
            barcode: this.Barcode,
            name: this.formInput.RAW_Name,
            uom_id: parseInt(this.formInput.UOM_ID),
            remaining_qty: parseFloat(this.formInput.Remaining_qty),
            active: this.ConverBooltoInt(this.RAW_Active),
            user: parseInt(this.strUserID),
            min_qty: parseFloat(this.formInput.Min_stock),
            max_qty: parseFloat(this.formInput.Max_stock),
            group_id: parseInt(this.formInput.Raw_Group),
            price: parseFloat(this.formInput.Price),
            percent_loss: parseFloat(this.formInput.Percent_Loss)
          }
          console.log(JSON.stringify(json))
          await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/addRaw", JSON.stringify(json))
            .toPromise().then(
              data => {
                Swal.fire({
                  text: "เพิ่มข้อมูลวัตถุดิบเรียบร้อยแล้ว",
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.value) {
                    // console.log("ngOnInit Again")
                    this.ngOnInit();
                  }
                });
              },
              error => {
                console.log(JSON.stringify(error))
                Swal.fire({
                  text: "ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้",
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
              });
          this.modalRef.hide()
        }
      } else {
        // console.log("Update RAW")
        let json = {
          id: parseInt(this.RAW_ID),
          barcode: this.Barcode,
          name: this.formInput.RAW_Name,
          uom_id: parseInt(this.formInput.UOM_ID),
          remaining_qty: parseFloat(this.formInput.Remaining_qty),
          active: this.ConverBooltoInt(this.RAW_Active),
          user: parseInt(this.strUserID),
          Min_qty: parseFloat(this.formInput.Min_stock),
          Max_qty: parseFloat(this.formInput.Max_stock),
          Group_id: parseInt(this.formInput.Raw_Group),
          price: parseFloat(this.formInput.Price),
          percent_loss: parseFloat(this.formInput.Percent_Loss),
        }
        console.log(JSON.stringify(json))
        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/updateRaw", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขข้อมูลวัตถุดิบเรียบร้อยแล้ว",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  // console.log("ngOnInit Again")
                  this.ngOnInit();
                }
              });
            },
            error => {
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถแก้ไขข้อมูลวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });

        this.modalRef.hide()
      }
    }

  }

  async SaveImportAction() {
    await this.SaveRAWImport()
    Swal.fire({
      text: "เพิ่มข้อมูลวัตถุดิบเรียบร้อยแล้ว",
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.value) {
        // console.log("ngOnInit Again")
        this.ngOnInit();
      }
    });

  }

  async SaveRAWImport() {
    // console.log(sale_header_id)
    console.log("Save Raw Import")
    for (let i = 0; i < this.items.length; i++) {
      // console.log("Loop :" + i)
      let json = {
        barcode: this.items[i].barcode.toString(),
        name: this.items[i].rawname,
        uom_id: parseInt(await this.CheckUOMExist(this.items[i].uomname).then()),
        remaining_qty: parseFloat(this.items[i].quantity),
        active: 1,
        user: parseInt(this.strUserID),
        min_qty: parseFloat(this.items[i].minstock),
        max_qty: parseFloat(this.items[i].maxstock),
        group_id: parseInt(await this.CheckGroupExist(this.items[i].groupname).then()),
        uom_id2: parseInt(await this.CheckUOMExist(this.items[i].uomname2).then()),
        qty2: parseFloat(this.items[i].qty2),
        price: parseFloat(this.items[i].price),
        qty1: parseFloat(this.items[i].qty1),
        percent_loss: parseFloat(this.items[i].percent_loss),
      }

      console.log(JSON.stringify(json))
      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/addRawImport", JSON.stringify(json))
        .toPromise().then(
          response => {
            if (response) {

              // this.getProducts();
            } else {
              console.log(JSON.stringify(response))
              Swal.fire({
                text: "ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            }
          },
          error => {
            console.log(JSON.stringify(error))
            Swal.fire({
              text: "ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้",
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK'
            })
          });
    }


    console.log("End Save Raw Import")
  }

  DeleteAction(raw) {
    this.RAW_ID = raw.id

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลวัตถุดิบหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteRAW()
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลวัตถุดิบเรียบร้อยแล้ว',
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

  async DeleteRAW() {
    let json = { id: parseInt(this.RAW_ID) }
    // this.modalRef.hide();
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/deleteRaw", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Delete UOMT Success")
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
        });

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });
  }

  async editModal(template: TemplateRef<any>, raw) {
    // this.getddlUOMs()   
    console.log(raw)
    this.RAW_ID = raw.id;
    this.Barcode = raw.barcode;

    this.formInput = {
      RAW_Name: raw.name,
      Remaining_qty: parseFloat(await this.checkEmpty(raw.remaining_qty)),
      UOM_ID: parseInt(raw.uom_id),
      Raw_Group: parseInt(raw.group_id),
      Min_stock: parseFloat(await this.checkEmpty(raw.min_qty)),
      Max_stock: parseFloat(await this.checkEmpty(raw.max_qty)),
      Price: parseFloat(await this.checkEmpty(raw.price)),
      Percent_Loss: parseFloat(await this.checkEmpty(raw.percent_loss))
    }

    // this.formInput.RAW_Name = raw.name;
    // this.formInput.Remaining_qty = parseFloat(raw.remaining_qty);
    // this.formInput.UOM_ID = parseInt(raw.uom_id);

    this.RAW_Active = this.ConverInttoBool(raw.active)
    this.RAW_Active_ID = raw.active

    this.modalRef = this.modalService.show(template, {
      class: 'modal-lg modal-dialog-centered',
    });

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;

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

  getddlGroups() {
    //confirm, unconfirm
    this.apiService.restApiGet(environment.apiLibertyUrl + "/share/getddlGroups")
      .subscribe(
        data => {
          // console.log(data)
          this.ddlGroups = data['data'];
          console.log(this.ddlGroups)
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

  async CheckBarcodeExist(barcode: string) {
    var chkBarcodeExist = 0
    for (let i = 0; i < this.raws.length; i++) {
      if (barcode == this.raws[i].barcode) {
        chkBarcodeExist = 1
        // chkBarcodeExist = parseInt(this.raws[i].id)
      }
    }

    return chkBarcodeExist
  }

  async CheckUOMExist(uomname: string) {
    var chkUOMExist = 0
    for (let i = 0; i < this.ddlUOMs.length; i++) {
      if (uomname == this.ddlUOMs[i].uom_name) {
        // alert(this.ddlUOMs[i].uom_id)
        chkUOMExist = this.ddlUOMs[i].uom_id
      }
    }
    return chkUOMExist
  }

  async CheckGroupExist(groupname: string) {
    var chkGroupExist = 0
    for (let i = 0; i < this.ddlGroups.length; i++) {
      if (groupname == this.ddlGroups[i].group_name) {
        // alert(this.ddlUOMs[i].uom_id)
        chkGroupExist = this.ddlGroups[i].group_id
      }
    }
    return chkGroupExist
  }

  openModalImport(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-xl modal-dialog-centered',
    });
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    if (evt.target.files.length > 0) {
      this.Filename = evt.target.files[0].name
      // console.log(evt.target.files[0].name);

      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) throw new Error('Cannot use multiple files');
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // this.addItems()
        /* save data */
        this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
        // console.log("data:", this.data);

        this.items = [];
        this.newItemStock = {};

        var count_row: any
        count_row = 0

        for (var index in this.data) {
          if (index != "0") {
            if (this.data[index][1] != "" && this.data[index][1] != undefined) {
              this.uomid = ""
              this.newItemStock.barcode = this.data[index][0]
              this.newItemStock.rawname = this.data[index][1]
              if (this.data[index][7] == null) {
                this.newItemStock.quantity = 0
                console.log(this.newItemStock.quantity)
              } else {
                this.newItemStock.quantity = this.data[index][7]
              }
              // this.newItemStock.quantity = this.data[index][7]
              this.newItemStock.groupname = this.data[index][6]
              this.newItemStock.minstock = this.data[index][9]
              this.newItemStock.maxstock = this.data[index][10]

              this.newItemStock.uomname = this.data[index][4]
              this.newItemStock.qty1 = this.data[index][5]

              this.newItemStock.uomname2 = this.data[index][2]
              this.newItemStock.qty2 = this.data[index][3]

              this.newItemStock.price = this.data[index][8]
              this.newItemStock.percent_loss = this.data[index][11]
              // this.newItemStock.uom_id = this.BundleProductMap[0].uom_id
              this.items.push(this.newItemStock);
              console.log(this.newItemStock);
              // console.log(this.items);
              this.newItemStock = {};
              count_row = count_row + 1
            }
          }
          this.linecount = count_row;
        }

        // for (var index in this.data) {
        //   if (index != "0") {
        //     if (this.data[index][1] != "") {
        //       this.BundleProductMap = this.BundleProductList.filter(data => data.bundle_name === this.data[index][1])
        //       if (this.BundleProductMap.length > 0) {
        //         this.newItemStock.barcode = this.data[index][0]
        //         this.newItemStock.productId = this.BundleProductMap[0].id
        //         this.newItemStock.productname = this.data[index][1]
        //         this.newItemStock.quantity = this.data[index][7]
        //         this.newItemStock.price = this.data[index][5]
        //         this.newItemStock.total_price = this.data[index][11]
        //         this.newItemStock.uom_id = this.BundleProductMap[0].uom_id
        //         this.items.push(this.newItemStock);
        //         // console.log(this.newItemStock);
        //         // console.log(this.items);
        //         this.newItemStock = {};
        //         count_row = count_row + 1
        //       } else {

        //       }
        //     }
        //   }
        //   this.linecount = count_row;
        // }
      };
      reader.readAsBinaryString(target.files[0]);
    }
  }

  removeItem(index) {
    this.items.splice(index, 1); // remove 1 item at ith place
  }

  async viewUOMTModal(template: TemplateRef<any>, raw) {
    console.log(raw)
    this.raw_id = raw.id;
    this.UOM_Name = raw.uom_name;
    // this.formInput = {
    //   UOM_Name: uom.name
    // }
    await this.getRAW_UOMT(this.raw_id)
    console.log(this.ddlROUMT)
    // this.getddlUOMs()
    this.formInput2 = {
      UOMID_1: raw.uom_id,
      Quantity_1: "",
      UOMID_2: "",
      Quantity_2: ""
    }
    // console.log(this.UOM_ID)
    // console.log(this.formInput2.UOMID_1)

    this.modalRef = this.modalService.show(template);

  }

  async getRAW_UOMT(raw_id: string) {
    //confirm, unconfirm
    let json = { id: parseInt(raw_id) }
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/getRUOMTs", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Delete UOMT Success")
          this.ddlROUMT = data['data']
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
        });

    // .subscribe(
    // data => {
    //   // console.log(data)
    //   this.ddlGroups = data['data'];
    //   console.log(this.ddlGroups)
    // },
    // error => {
    //   //console.log(error);
    // });
  }

  addUOMTModal(template: TemplateRef<any>) {
    this.UOMT_ID = "";
    this.isSubmit2 = false

    // this.formInput2 = {
    //   UOMID_1: this.UOM_ID,
    //   Quantity_1: "",
    //   UOMID_2: "",
    //   Quantity_2: ""
    // }

    this.modalRef = this.modalService.show(template);

  }

  async SaveUOMT(form2: any) {
    if (!form2.valid) {
      this.isSubmit2 = true;
      return;
    } else {
      // console.log(this.UOM_Name)
      // console.log(this.UOMT_ID)
      if (this.UOMT_ID === "") {
        // console.log("Save UOMT")
        // console.log(this.UOMT_ID)
        let json = {
          raw_id: parseInt(this.raw_id),
          uom_id1: parseInt(this.formInput2.UOMID_1),
          quantity1: parseFloat(this.formInput2.Quantity_1),
          uom_id2: parseInt(this.formInput2.UOMID_2),
          quantity2: parseFloat(this.formInput2.Quantity_2),
          active: 1,
          user: parseInt(this.strUserID),
        }
        console.log(JSON.stringify(json))


        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/addRUOMT", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "เพิ่มข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            },
            error => {
              console.log(JSON.stringify(json))
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
        this.modalRef.hide();
      } else {
        // console.log("Update UOMT")
        // console.log(this.UOMT_ID)
        let json = {
          id: parseInt(this.UOMT_ID),
          raw_id: parseInt(this.raw_id),
          uom_id1: parseInt(this.formInput2.UOMID_1),
          quantity1: parseFloat(this.formInput2.Quantity_1),
          uom_id2: parseInt(this.formInput2.UOMID_2),
          quantity2: parseFloat(this.formInput2.Quantity_2),
          active: 1,
          user: parseInt(this.strUserID),
        }
        // console.log(JSON.stringify(json))


        await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/updateRUOMT", JSON.stringify(json))
          .toPromise().then(
            data => {
              Swal.fire({
                text: "แก้ไขข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            },
            error => {
              console.log(JSON.stringify(error))
              Swal.fire({
                text: "ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้",
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
              })
            });
        this.modalRef.hide();
      }
    }
    // this.idupdate = this.RoleId
    // if (this.RoleId === "") {
    //console.log("Save UOMT")

  }

  editUOMTModal(template: TemplateRef<any>, Group) {
    //this.getddlUOMs()   \    
    this.UOMT_ID = Group.id;
    this.formInput2.UOMID_1 = Group.uom_id1;
    this.formInput2.Quantity_1 = Group.quantity1;
    this.formInput2.UOMID_2 = Group.uom_id2;
    this.formInput2.Quantity_2 = Group.quantity2;

    this.modalRef = this.modalService.show(template);

  }

  async DeleteUOMT(Group) {
    // console.log("Delete UOMT")
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลแปลงหน่วยนับหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.UOMT_ID = Group.id;
        let json = { id: parseInt(this.UOMT_ID) }
        // this.modalRef.hide();
        // console.log(JSON.stringify(json))
        this.apiService.restApiSendParm(environment.apiLibertyUrl + "/raw/deleteRUOMT", JSON.stringify(json))
          .toPromise().then(
            data => {
              // console.log("Delete UOMT Success")
            },
            error => {

            });
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว',
          'success'
        )
      }
    })
  }

  async checkEmpty(value: any) {
    if (value == "") {
      return 0
    } else {
      return value
    }
  }

}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



