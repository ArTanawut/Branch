import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import 'sweetalert2/src/sweetalert2.scss';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtOptionsBundle: DataTables.Settings = {};
  products = [];
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
  private myEventSubscription: any;
  private myEventSubscription1: any;
  items: Array<any> = [];
  newItem: any = {};
  item_raw_name: any;
  item_uom_id: any;
  item_uom_name: any;
  Barcode: any;
  UOM_ID: any;
  CheckAddBundle: any;




  constructor(private http: HttpClient,
    private apiService: ApiService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    console.log("Ok")
    this.getProducts()
    this.getddlUOMs();
    this.getddlRAWs();


  }

  getProducts() {
    this.myEventSubscription = this.apiService.restApiGet("http://localhost:8080/product/getProducts")
      .subscribe(
        data => {
          //this.products = (data as any).data ;
          this.products = data['data'];
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

  getRoles1() {
    this.apiService.restApiGet("http://localhost:8080/role/getRoles")
      .subscribe(
        data => {
          this.products = data['data'];

          $(function () {
            $('data').DataTable();
          });
          // console.log(this.ddlRole)
        },
        error => {
          //console.log(error);
        });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }

    if (this.myEventSubscription) {
      this.myEventSubscription.unsubscribe();
    }

    if (this.myEventSubscription1) {
      this.myEventSubscription1.unsubscribe();
    }

    console.log("Destroy")
  }

  onNewProduct() {
    this.Barcode = "";
    this.Product_ID = "";
    this.Product_Name = "";
    this.RAW_ID = "";
    this.UOM_ID = "";
    this.Product_Active = true;
    this.ProductType = "";
    this.items = [];
    this.newItem = {};

  }

  SaveProduct() {
    console.log(this.Product_ID)
    if (this.Product_ID == "") { //Add Product
      if (parseInt(this.ProductType) == 1) {
        console.log("Save Product FG")
        let json = {
          barcode: this.Barcode,
          name: this.Product_Name,
          uom_id: parseInt(this.UOM_ID),
          product_type: parseInt(this.ProductType),
          image: "",
          active: this.ConverBooltoInt(this.Product_Active),
          user: 9,
        }
        console.log(JSON.stringify(json))
        this.apiService.restApiSendParm("http://localhost:8080/product/addProduct", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                Swal.fire('เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
                // this.getProducts();
              } else {
                // console.log("Login Fail")
                Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสินค้าได้', 'error');
              }
            },
            error => {
              // console.log(error)
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสินค้าได้', 'error');
            });
      }
      else if (parseInt(this.ProductType) == 2) {
        console.log("Save Product Bundle")
        let json = {
          barcode: this.Barcode,
          name: this.Product_Name,
          uom_id: parseInt(this.UOM_ID),
          product_type: parseInt(this.ProductType),
          image: "",
          active: this.ConverBooltoInt(this.Product_Active),
          user: 9,
        }
        //console.log(JSON.stringify(json))

        // this.AddBundle("99");

        this.apiService.restApiSendParm("http://localhost:8080/product/addProduct", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                // console.log(response['data'][0].product_id)
                // this.DeleteBundle(response['data'][0].product_id);
                this.AddBundle(response['data'][0].product_id);

                Swal.fire('เพิ่มข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
                // this.getProducts();
              } else {
                // console.log("Login Fail")
                Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสินค้าได้', 'error');
              }
            },
            error => {
              // console.log(error)
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลสินค้าได้', 'error');
            });
      }
    } else { //Update Product
      if (parseInt(this.ProductType) == 1) {
        console.log("Update Product FG")
        let json = {
          id: parseInt(this.Product_ID),
          barcode: this.Barcode,
          name: this.Product_Name,
          uom_id: parseInt(this.UOM_ID),
          product_type: parseInt(this.ProductType),
          image: "",
          active: this.ConverBooltoInt(this.Product_Active),
          user: 9,
        }
        console.log(JSON.stringify(json))
        this.apiService.restApiSendParm("http://localhost:8080/product/updateProduct", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                this.DeleteBundle(this.Product_ID);
                Swal.fire('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
                // this.getProducts();
              } else {
                // console.log("Login Fail")
                Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
              }
            },
            error => {
              // console.log(error)
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
            });
      }
      else if (parseInt(this.ProductType) == 2) {
        console.log("Update Product Bundle")
        let json = {
          id: parseInt(this.Product_ID),
          barcode: this.Barcode,
          name: this.Product_Name,
          uom_id: parseInt(this.UOM_ID),
          product_type: parseInt(this.ProductType),
          image: "",
          active: this.ConverBooltoInt(this.Product_Active),
          user: 9,
        }
        //console.log(JSON.stringify(json))

        // this.AddBundle("99");

        this.apiService.restApiSendParm("http://localhost:8080/product/updateProduct", JSON.stringify(json))
          .subscribe(
            response => {
              if (response) {
                // console.log(response['data'][0].product_id)
                this.DeleteBundle(this.Product_ID);
                // this.AddBundle(this.Product_ID);

                Swal.fire('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
                // this.getProducts();
              } else {
                // console.log("Login Fail")
                Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
              }
            },
            error => {
              // console.log(error)
              Swal.fire('', 'ไม่สามารถแก้ไขข้อมูลสินค้าได้', 'error');
            });
      }
    }

  }

  AddBundle(product_id: string) {
    console.log(product_id)
    console.log("Add Bundle")
    for (let i = 0; i < this.items.length; i++) {
      // console.log("Loop :" + i)
      let json = {
        product_id: parseInt(product_id),
        raw_id: parseInt(this.items[i].raw_id),
        quantity: parseFloat(this.items[i].quantity),
        active: 1,
        user: 9,
      }

      console.log(JSON.stringify(json))
      this.apiService.restApiSendParm("http://localhost:8080/product/addBundle", JSON.stringify(json))
        .subscribe(
          response => {
            if (response) {
              // this.getProducts();
            } else {
              // console.log("Login Fail")
              Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้', 'error');
            }
          },
          error => {
            // console.log(error)
            Swal.fire('', 'ไม่สามารถเพิ่มข้อมูลวัตถุดิบได้', 'error');
          });
    }
  }

  DeleteBundle(product_id: string) {
    console.log(product_id)
    console.log("Delete Bundle")
    let json = {
      id: parseInt(product_id)
    }

    console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/product/deleteBundle", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            if (this.ProductType == 2) {
              this.AddBundle(product_id)
            }
            // this.getProducts();
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลวัตถุดิบได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลวัตถุดิบได้', 'error');
        });
  }

  UpdateProduct() {
    console.log("Update Product")
    let json = {
      id: parseInt(this.Product_ID),
      name: this.Product_Name,
      active: this.ConverBooltoInt(this.Product_Active),
      user: "system",
    }
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/product/updateProduct", JSON.stringify(json))
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

  DeleteProduct() {
    console.log("Delete Product")
    let json = { id: parseInt(this.Product_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/product/deleteProduct", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลสินค้าเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลสินค้าได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลสินค้าได้', 'error');
        });
  }

  getddlUOMs() {
    //confirm, unconfirm
    this.apiService.restApiGet("http://localhost:8080/share/ddlUOMs")
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
    this.apiService.restApiGet("http://localhost:8080/share/ddlRAWs")
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
        user: 9,
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm("http://localhost:8080/product/addBundle", JSON.stringify(json))
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
        user: 9,
      }
      // console.log(JSON.stringify(json))


      this.apiService.restApiSendParm("http://localhost:8080/product/updateBundle", JSON.stringify(json))
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
    console.log("View Bundle")

    let json = {
      id: parseInt(this.Product_ID)
    }
    // console.log(JSON.stringify(json))

    this.apiService.restApiSendParm("http://localhost:8080/product/getBundleProduct", JSON.stringify(json))
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

  DeleteBundle1() {
    console.log("Delete Bundle")
    let json = { id: parseInt(this.Bundle_ID) }
    this.modalRef.hide();
    // console.log(JSON.stringify(json))
    this.apiService.restApiSendParm("http://localhost:8080/product/deleteBundle", JSON.stringify(json))
      .subscribe(
        response => {
          if (response) {
            Swal.fire('ลบข้อมูลแปลงหน่วยนับเรียบร้อยแล้ว', '', 'success');
          } else {
            // console.log("Login Fail")
            Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
          }
        },
        error => {
          // console.log(error)
          Swal.fire('', 'ไม่สามารถลบข้อมูลแปลงหน่วยนับได้', 'error');
        });
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  editModal(template: TemplateRef<any>, product) {
    // this.getddlUOMs();
    this.Barcode = product.barcode;
    this.Product_ID = product.id;
    this.Product_Name = product.name;
    this.ProductType = product.product_type;
    this.UOM_ID = product.uom_id;

    this.Product_Active = this.ConverInttoBool(product.active);
    this.Product_Active_ID = product.active;

    this.getBundles();

    this.modalRef = this.modalService.show(template);

  }

  addBundleModal(template: TemplateRef<any>) {
    this.Bundle_ID = "";
    this.Quantity_1 = "";
    this.ProductID_2 = "";
    this.Quantity_2 = "";

    this.modalRef = this.modalService.show(template);

  }

  viewBundleModal(template: TemplateRef<any>, product) {
    this.Product_ID = product.id;
    this.Product_Name = product.name;
    this.getBundles()

    this.getddlUOMs()
    this.ProductID_1 = this.Product_ID;
    console.log(this.Product_ID)
    console.log(this.ProductID_1)

    this.modalRef = this.modalService.show(template);

  }

  editBundleModal(template: TemplateRef<any>, uomts) {
    //this.getddlProducts()   \    
    this.Bundle_ID = uomts.id;
    this.ProductID_1 = uomts.uom_id1;
    this.Quantity_1 = uomts.quantity1;
    this.ProductID_2 = uomts.uom_id2;
    this.Quantity_2 = uomts.quantity2;

    this.modalRef = this.modalService.show(template);

  }

  deleteModal(template: TemplateRef<any>, product) {
    this.Product_ID = product.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  deleteModal1(template: TemplateRef<any>, uomt) {
    this.Bundle_ID = uomt.id;
    this.modalRef = this.modalService.show(template, {
      class: 'modal-sm modal-dialog-centered',
    });
  }

  decline() {
    this.modalRef.hide();
  }

  addItems() {
    this.newItem.raw_name = this.item_raw_name;
    this.newItem.uom_id = this.item_uom_id;
    this.newItem.uom_name = this.item_uom_name;
    this.items.push(this.newItem);
    console.log(this.items);
    this.newItem = {};
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
