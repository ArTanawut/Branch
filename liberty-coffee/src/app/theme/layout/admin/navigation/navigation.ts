import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}


const NavigationItemsAdmin = [
  {
    id: 'dashboard-liberty',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    classes: 'nav-item',
    icon: 'fa fa-chart-pie'
  },
  {
    id: 'raw-material-inventory',
    title: 'วัตถุดิบคงคลัง',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'import-raw',
        title: 'นำเข้าวัตถุดิบ',
        type: 'item',
        // hidden: 'false',
        url: '/import-raw',
        classes: 'nav-item',
        icon: 'fa fa-file-import'
      },
      {
        id: 'export-raw',
        title: 'นำออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw',
        classes: 'nav-item'
      }
      ,
      {
        id: 'export-raw-byimport',
        title: 'นำออกวัตถุดิบ (Import Data)',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw-byimport',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'main-data',
    title: 'ข้อมูลหลัก',
    type: 'group',
    children: [
      {
        id: 'product',
        title: 'สินค้า',
        type: 'item',
        icon: 'fa fa-coffee',
        url: '/product',
        classes: 'nav-item'
      },
      {
        id: 'raw-material',
        title: 'วัตถุดิบ',
        type: 'item',
        icon: 'fa fa-drumstick-bite',
        url: '/raw-material',
        classes: 'nav-item'
      },
      {
        id: 'unit',
        title: 'หน่วยนับ',
        type: 'item',
        icon: 'fa fa-weight',
        url: '/uom',
        classes: 'nav-item'
      },
      {
        id: 'group',
        title: 'หมวดหมู่',
        type: 'item',
        icon: 'fa fa-object-group',
        url: '/group',
        classes: 'nav-item'
      }

    ]
  },
  {
    id: 'report',
    title: 'รายงาน',
    type: 'group',
    children: [
      {
        id: 'stock-movement',
        title: 'รายงานการเข้าออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-chart-bar',
        url: '/stock-movement',
        classes: 'nav-item'
      },
      {
        id: 'net-profit',
        title: 'รายงานสรุปยอดขาย',
        type: 'item',
        icon: 'fa fa-dollar-sign',
        url: '/net-profit',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'ผู้ใช้งาน',
    type: 'group',
    children: [
      {
        id: 'user',
        title: 'ผู้ใช้งาน',
        type: 'item',
        icon: 'fa fa-user',
        url: '/user',
        classes: 'nav-item'
      },
      {
        id: 'role',
        title: 'กลุ่มผู้ใช้งาน',
        type: 'item',
        icon: 'fa fa-users',
        url: '/role',
        classes: 'nav-item'
      }
      // ,
      // {
      //   id: 'form-validation',
      //   title: 'Form Validation',
      //   type: 'item',
      //   url: '/forms/validation',
      //   classes: 'nav-item'
      // }
    ]
  },
  {
    id: 'shop-management',
    title: 'การจัดการร้านค้า',
    type: 'group',
    children: [
      {
        id: 'shop',
        title: 'ร้านค้า',
        type: 'item',
        icon: 'fa fa-store-alt',
        url: '/shop',
        classes: 'nav-item'
      },
      {
        id: 'branch',
        title: 'สาขา',
        type: 'item',
        icon: 'fa fa-project-diagram',
        url: '/branch',
        classes: 'nav-item'
      }
    ]
  }
];

const NavigationItemsManager = [
  {
    id: 'dashboard-liberty',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard',
    classes: 'nav-item',
    icon: 'fa fa-chart-pie'
  },
  {
    id: 'raw-material-inventory',
    title: 'วัตถุดิบคงคลัง',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'import-raw',
        title: 'นำเข้าวัตถุดิบ',
        type: 'item',
        // hidden: 'false',
        url: '/import-raw',
        classes: 'nav-item',
        icon: 'fa fa-file-import'
      },
      {
        id: 'export-raw',
        title: 'นำออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw',
        classes: 'nav-item'
      }
      ,
      {
        id: 'export-raw-byimport',
        title: 'นำออกวัตถุดิบ (Import Data)',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw-byimport',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'main-data',
    title: 'ข้อมูลหลัก',
    type: 'group',
    children: [
      {
        id: 'product',
        title: 'สินค้า',
        type: 'item',
        icon: 'fa fa-coffee',
        url: '/product',
        classes: 'nav-item'
      },
      {
        id: 'raw-material',
        title: 'วัตถุดิบ',
        type: 'item',
        icon: 'fa fa-drumstick-bite',
        url: '/raw-material',
        classes: 'nav-item'
      },
      {
        id: 'unit',
        title: 'หน่วยนับ',
        type: 'item',
        icon: 'fa fa-weight',
        url: '/uom',
        classes: 'nav-item'
      },
      {
        id: 'group',
        title: 'หมวดหมู่',
        type: 'item',
        icon: 'fa fa-object-group',
        url: '/group',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'report',
    title: 'รายงาน',
    type: 'group',
    children: [
      {
        id: 'stock-movement',
        title: 'รายงานการเข้าออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-chart-bar',
        url: '/stock-movement',
        classes: 'nav-item'
      },
      {
        id: 'net-profit',
        title: 'รายงานสรุปยอดขาย',
        type: 'item',
        icon: 'fa fa-dollar-sign',
        url: '/net-profit',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'ผู้ใช้งาน',
    type: 'group',
    children: [
      {
        id: 'user',
        title: 'ผู้ใช้งาน',
        type: 'item',
        icon: 'fa fa-user',
        url: '/user',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'shop-management',
    title: 'การจัดการร้านค้า',
    type: 'group',
    children: [
      {
        id: 'branch',
        title: 'สาขา',
        type: 'item',
        icon: 'fa fa-project-diagram',
        url: '/branch',
        classes: 'nav-item'
      }
    ]
  }
];

const NavigationItemsEmployee = [
  {
    id: 'raw-material-inventory',
    title: 'วัตถุดิบคงคลัง',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'import-raw',
        title: 'นำเข้าวัตถุดิบ',
        type: 'item',
        // hidden: 'false',
        url: '/import-raw',
        classes: 'nav-item',
        icon: 'fa fa-file-import'
      },
      {
        id: 'export-raw',
        title: 'นำออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw',
        classes: 'nav-item'
      }
      ,
      {
        id: 'export-raw-byimport',
        title: 'นำออกวัตถุดิบ (Import Data)',
        type: 'item',
        icon: 'fa fa-file-export',
        url: '/export-raw-byimport',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'main-data',
    title: 'ข้อมูลหลัก',
    type: 'group',
    children: [
      {
        id: 'product',
        title: 'สินค้า',
        type: 'item',
        icon: 'fa fa-coffee',
        url: '/product',
        classes: 'nav-item'
      },
      {
        id: 'raw-material',
        title: 'วัตถุดิบ',
        type: 'item',
        icon: 'fa fa-drumstick-bite',
        url: '/raw-material',
        classes: 'nav-item'
      },
      {
        id: 'unit',
        title: 'หน่วยนับ',
        type: 'item',
        icon: 'fa fa-weight',
        url: '/uom',
        classes: 'nav-item'
      },
      {
        id: 'group',
        title: 'หมวดหมู่',
        type: 'item',
        icon: 'fa fa-object-group',
        url: '/group',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'report',
    title: 'รายงาน',
    type: 'group',
    children: [
      {
        id: 'stock-movement',
        title: 'รายงานการเข้าออกวัตถุดิบ',
        type: 'item',
        icon: 'fa fa-chart-bar',
        url: '/stock-movement',
        classes: 'nav-item'
      },
      {
        id: 'net-profit',
        title: 'รายงานสรุปยอดขาย',
        type: 'item',
        icon: 'fa fa-dollar-sign',
        url: '/net-profit',
        classes: 'nav-item'
      }
    ]
  }
];


@Injectable()
export class NavigationItem {
  public get(role: string) {
    if (role == "1") {
      return NavigationItemsAdmin;
    } else if (role == "2") {
      return NavigationItemsManager;
    } else if (role == "3") {
      return NavigationItemsEmployee;
    }

  }
}
