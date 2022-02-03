import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

const { read, write, utils } = XLSX;

type AOA = any[][];
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  items: Array<any> = [];
  newItemStock: any = {};

  constructor() { }

  ngOnInit(): void {
  }

  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';

  onFileChange(evt: any) {
    /* wire up file reader */
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
      console.log("data:", this.data);

      for (var index in this.data) {
        if (index != "0") {
          if (this.data[index][1] != "") {
            this.newItemStock.barcode = this.data[index][0]
            this.newItemStock.productname = this.data[index][1]
            this.newItemStock.quantity = this.data[index][7]
            this.newItemStock.price = this.data[index][5]
            this.newItemStock.total_price = this.data[index][11]
            this.items.push(this.newItemStock);
            console.log(this.items);
            this.newItemStock = {};
          }



        }
        // console.log(index); // prints indexes: 0, 1, 2, 3

        // console.log(this.data[index]); // prints elements: 10, 20, 30, 40
      }

      // this.data.map(res => {
      //   if (res[0] === "no") {
      //     console.log(res[0]);
      //   } else {
      //     console.log(res[0]);
      //   }
      // })
    };
    reader.readAsBinaryString(target.files[0]);
  }


  export(): void {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  addItems() {
    this.newItemStock.barcode = "'123456789";
    this.newItemStock.productname = "สปาเก็ตตี้พริกแห้งเบค่อน";
    this.newItemStock.quantity = "2";
    this.newItemStock.price = "100";
    this.newItemStock.total_price = "200";
    this.items.push(this.newItemStock);
    console.log(this.items);
    this.newItemStock = {};
  }


}
