import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';
import { environment } from 'src/environments/environment';
import { async } from 'rxjs/internal/scheduler/async';

export class FormInput {
  Product_Name: any
  ProductType: any
  UOM_ID: any
}

// export class FormInput2 {
//   raw_id: any
//   quantity: any
// }

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnDestroy, OnInit {
  strFullName: string;
  strUserID: string;
  private ProductSubscription: any;
  private BundleSubscription: any;

  dtOptions: any;
  dtOptionsBundle: any;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();

  products = [];
  modalRef: BsModalRef;

  Product_ID;
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

  items: Array<any> = [];
  newItem: any = {};
  item_raw_name: any;
  item_uom_id: any;
  item_uom_name: any;
  Barcode: any;
  CheckAddBundle: any;

  formInput: FormInput;
  form: any;
  public isSubmit: boolean;


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

  pageLoad() {
    this.getProducts()
    this.getddlUOMs();
    this.getddlRAWs();

    this.isSubmit = false
    // this.isSubmit2 = false
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.dtTrigger2) {
      this.dtTrigger2.unsubscribe();
    }

    if (this.ProductSubscription) {
      this.ProductSubscription.unsubscribe();
    }

    if (this.BundleSubscription) {
      this.BundleSubscription.unsubscribe();
    }
    // console.log("Destroy")
  }

  getProducts() {
    this.ProductSubscription = this.apiService.restApiGet(environment.apiLibertyUrl + "/product/getProducts")
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.products = data['data'];
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

  onNewProduct() {
    this.formInput = {
      Product_Name: '',
      ProductType: '',
      UOM_ID: ''
    }

    this.Barcode = "";
    this.Product_ID = "";
    this.RAW_ID = "";
    this.Product_Active = true;
    this.items = [];
    this.newItem = {};

    this.isSubmit = false
    // this.formInput.Product_Name = "";
    // this.formInput.UOM_ID = "";
    // this.formInput.ProductType = "";


  }

  async SaveProduct(form: any) {
    if (!form.valid) {
      this.isSubmit = true;
      return;
    } else {
      // console.log(this.Product_ID)
      if (this.Product_ID == "") { //Add Product
        var chkBarcodeExist = await this.CheckBarcodeExist(this.Barcode)
        var chkProductNameExist = await this.CheckProductNameExist(this.formInput.Product_Name)
        if (chkBarcodeExist == 1 || chkProductNameExist == 1) {
          // Swal.fire({ icon: 'error', title: '', showConfirmButton: false });
          // $('.swal2-container').css("z-index", '999999');
          Swal.fire({
            text: "ไม่สามารถเพิ่มข้อมูลสินค้าได้ เนื่องจาก Barcode หรือชื่อสินค้า ซ้ำ",
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          })
          $('.swal2-container').css("z-index", '999999');
        } else {
          if (parseInt(this.formInput.ProductType) == 1) {
            // console.log("Save Product FG")
            let json = {
              barcode: this.Barcode,
              name: this.formInput.Product_Name,
              uom_id: parseInt(this.formInput.UOM_ID),
              product_type: parseInt(this.formInput.ProductType),
              image: "",
              active: this.ConverBooltoInt(this.Product_Active),
              user: parseInt(this.strUserID),
            }
            // console.log(JSON.stringify(json))
            await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/addProduct", JSON.stringify(json))
              .toPromise().then(
                data => {
                  Swal.fire({
                    text: "เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว",
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
                    text: "ไม่สามารถเพิ่มข้อมูลสินค้าได้",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  })
                });
          }
          else if (parseInt(this.formInput.ProductType) == 2) {
            console.log("Save Product Bundle")
            let json = {
              barcode: this.Barcode,
              name: this.formInput.Product_Name,
              uom_id: parseInt(this.formInput.UOM_ID),
              product_type: parseInt(this.formInput.ProductType),
              image: "",
              active: this.ConverBooltoInt(this.Product_Active),
              user: parseInt(this.strUserID),
            }
            //console.log(JSON.stringify(json))

            // this.AddBundle("99");

            await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/addProduct", JSON.stringify(json))
              .toPromise().then(
                async response => {
                  if (response) {
                    await this.AddBundle(response['data'][0].product_id);
                    // console.log("Run Step2")
                    Swal.fire({
                      text: "เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว",
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
                      text: "ไม่สามารถเพิ่มข้อมูลสินค้าได้",
                      icon: 'error',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'OK'
                    })
                  }
                },
                error => {
                  console.log(JSON.stringify(error))
                  Swal.fire({
                    text: "ไม่สามารถเพิ่มข้อมูลสินค้าได้",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  })
                });
          }
        }
      } else { //Update Product
        if (parseInt(this.formInput.ProductType) == 1) {
          // console.log("Update Product FG")
          let json = {
            id: parseInt(this.Product_ID),
            barcode: this.Barcode,
            name: this.formInput.Product_Name,
            uom_id: parseInt(this.formInput.UOM_ID),
            product_type: parseInt(this.formInput.ProductType),
            image: "",
            active: this.ConverBooltoInt(this.Product_Active),
            user: parseInt(this.strUserID),
          }
          // console.log(JSON.stringify(json))
          await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/updateProduct", JSON.stringify(json))
            .toPromise().then(
              async response => {
                if (response) {
                  await this.DeleteBundle(this.Product_ID)
                  // console.log("Run Step2")
                  Swal.fire({
                    text: "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว",
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
                    text: "ไม่สามารถแก้ไขข้อมูลสินค้าได้",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  })
                }
              },
              error => {
                console.log(JSON.stringify(error))
                Swal.fire({
                  text: "ไม่สามารถแก้ไขข้อมูลสินค้าได้",
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
              });
          // .subscribe(
          //     response => {
          //       if (response) {
          //         this.DeleteBundle(this.Product_ID);
          //         Swal.fire('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
          //         // this.getProducts();
          //       } else {
          //         // console.log("Login Fail")
          //         Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
          //       }
          //     },
          //     error => {
          //       // console.log(error)
          //       Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
          //     });
        }
        else if (parseInt(this.formInput.ProductType) == 2) {
          // console.log("Update Product Bundle")
          let json = {
            id: parseInt(this.Product_ID),
            barcode: this.Barcode,
            name: this.formInput.Product_Name,
            uom_id: parseInt(this.formInput.UOM_ID),
            product_type: parseInt(this.formInput.ProductType),
            image: "",
            active: this.ConverBooltoInt(this.Product_Active),
            user: parseInt(this.strUserID),
          }
          //console.log(JSON.stringify(json))

          // this.AddBundle("99");
          await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/updateProduct", JSON.stringify(json))
            .toPromise().then(
              async response => {
                if (response) {
                  await this.DeleteBundle(this.Product_ID)
                  // console.log("Run Step2")
                  Swal.fire({
                    text: "แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว",
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
                    text: "ไม่สามารถแก้ไขข้อมูลสินค้าได้",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                  })
                }
              },
              error => {
                console.log(JSON.stringify(error))
                Swal.fire({
                  text: "ไม่สามารถแก้ไขข้อมูลสินค้าได้",
                  icon: 'error',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                })
              });

        }
      }
    }
    this.modalRef.hide()

  }

  async AddBundle(product_id: string) {
    // console.log(product_id)
    // console.log("Add Bundle")
    for (let i = 0; i < this.items.length; i++) {
      // console.log("Loop :" + i)
      let json = {
        product_id: parseInt(product_id),
        raw_id: parseInt(this.items[i].raw_id),
        quantity: parseFloat(this.items[i].quantity),
        active: 1,
        user: parseInt(this.strUserID),
      }

      // console.log(JSON.stringify(json))
      await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/addBundle", JSON.stringify(json))
        .toPromise().then(
          data => {
            // console.log("Run Step1")
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
  }

  async DeleteBundle(product_id: string) {
    console.log(product_id)
    // console.log("Delete Bundle")
    let json = {
      id: parseInt(product_id)
    }

    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/deleteBundle", JSON.stringify(json))
      .toPromise().then(
        response => {
          if (response) {
            if (this.formInput.ProductType == 2) {
              this.AddBundle(product_id)
            }
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

  UpdateProduct() {
    console.log("Update Product")
    let json = {
      id: parseInt(this.Product_ID),
      name: this.formInput.Product_Name,
      active: this.ConverBooltoInt(this.Product_Active),
      user: this.strFullName,
    }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/updateProduct", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('แก้ไขข้อมูลหน่วยนับเรียบร้อยแล้ว', '', 'success');
            this.getProducts();
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลหน่วยนับได้', 'error');
        });
  }

  DeleteAction(product) {
    this.Product_ID = product.id;

    // console.log(this.UOM_ID)
    Swal.fire({
      // title: 'Are you sure?',
      text: "ต้องการลบข้อมูลสินค้าหรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.value) {
        // console.log("Go to DeleteUOM")
        await this.DeleteProduct()
        // console.log("Run Step2")
        Swal.fire(
          'Deleted!',
          'ลบข้อมูลสินค้าเรียบร้อยแล้ว',
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

  async DeleteProduct() {
    // console.log("Delete Product")
    let json = { id: parseInt(this.Product_ID) }
    // this.modalRef.hide();
    // console.log(JSON.stringify(json))
    await this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/deleteProduct", JSON.stringify(json))
      .toPromise().then(
        data => {
          // console.log("Run Step1")
          // console.log("Delete UOMT Success")
        },
        error => {
          console.log(JSON.stringify(json))
          console.log(JSON.stringify(error))
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

  SaveBundle() {
    // console.log(this.Product_Name)
    console.log(this.Bundle_ID)
    if (this.Bundle_ID === "") {
      console.log("Save Bundle")
      // console.log(this.Bundle_ID)
      let json = {
        uom_id1: parseInt(this.ProductID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.ProductID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: parseInt(this.strUserID),
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/addBundle", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('เพิ่มข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getProducts();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลแปลงหน่วยนับได้', 'error');
          });
      this.modalRef.hide();
    } else {
      console.log("Update Bundle")
      // console.log(this.Bundle_ID)
      let json = {
        id: parseInt(this.Bundle_ID),
        uom_id1: parseInt(this.ProductID_1),
        quantity1: parseFloat(this.Quantity_1),
        uom_id2: parseInt(this.ProductID_2),
        quantity2: parseFloat(this.Quantity_2),
        active: 1,
        user: parseInt(this.strUserID),
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/updateBundle", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              Swal.fire('แก้ไขข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
              // this.getProducts();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลแปลงหน่วยนับได้', 'error');
          });
      this.modalRef.hide();
    }
    // this.idupdate = this.RoleId
    // if (this.RoleId === "") {
    //console.log("Save Bundle")

  }

  getBundles() {
    // console.log("View Bundle")

    let json = {
      id: parseInt(this.Product_ID)
    }
    // console.log(JSON.stringify(json))

    this.BundleSubscription = this.apiService.restApiSendParm(environment.apiLibertyUrl + "/product/getBundleProduct", JSON.stringify(json))
      .subscribe(
        data => {
          this.items = data['data'];

          // $(function () {
          //   $('data').DataTable({
          //     // paging: false,
          //     // searching: false
          //   });
          // });

          this.dtTrigger2.next();
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });

    // this.ngOnDestroy();
  }

  async CheckBarcodeExist(barcode: string) {
    var chkBarcodeExist = 0
    for (let i = 0; i < this.products.length; i++) {
      if (barcode == this.products[i].barcode) {
        chkBarcodeExist = 1
        // chkBarcodeExist = parseInt(this.raws[i].id)
      }
    }

    return chkBarcodeExist
  }

  async CheckProductNameExist(productname: string) {
    var chkProductNameExist = 0
    for (let i = 0; i < this.products.length; i++) {
      if (productname == this.products[i].name) {
        chkProductNameExist = 1
        // chkBarcodeExist = parseInt(this.raws[i].id)
      }
    }

    return chkProductNameExist
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, product) {
    // this.getddlUOMs();
    this.Barcode = product.barcode;
    this.Product_ID = product.id;

    this.formInput = {
      Product_Name: product.name,
      ProductType: product.product_type,
      UOM_ID: product.uom_id
    }
    // this.formInput.Product_Name = product.name;
    // this.formInput.ProductType = product.product_type;
    // this.formInput.UOM_ID = product.uom_id;

    this.Product_Active = this.ConverInttoBool(product.active);
    this.Product_Active_ID = product.active;

    this.getBundles();

    this.modalRef = this.modalService.show(template);

  }


  addItems() {
    // console.log(this.newItem.raw_id)
    // console.log(this.newItem.quantity)
    if (this.newItem.raw_id != undefined && this.newItem.raw_id != ""
      && this.newItem.quantity != undefined && this.newItem.quantity != "") {
      this.newItem.raw_name = this.item_raw_name;
      this.newItem.uom_id = this.item_uom_id;
      this.newItem.uom_name = this.item_uom_name;
      this.items.push(this.newItem);
      console.log(this.items);
      this.newItem = {};
    }
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
          this.item_uom_id = this.ddlRAWs[i].uom_id
          this.item_uom_name = this.ddlRAWs[i].uom_name
        }
      }
    }
    // this.item_raw_name = deviceValue[0].raw_name;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 || (charCode >= 48 && charCode <= 57)) {
      return true;
    }
    return false;

  }



}
