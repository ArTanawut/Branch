import { Component, OnInit } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';
import { NgNumberFormatterModule } from 'ng-number-formatter';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  Shop_Name: any;
  Shop_Detail: any;
  Time_Open: any;
  Time_Close: any;
  public maskHour = [/\d/, /\d/, ':', /\d/, /\d/];


  constructor(private textMask: TextMaskModule,
    private NgNumber: NgNumberFormatterModule) { }

  ngOnInit(): void {
  }

}