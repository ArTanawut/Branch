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

let Role = "Admin";
// console.log(Role);

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
      },
      {
        id: 'permission',
        title: 'สิทธิ์การเข้าใช้งาน',
        type: 'item',
        icon: 'fa fa-user-lock',
        url: '/permission',
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
  ,
  {
    id: 'example',
    title: 'Example',
    type: 'group',
    children: [
      {
        id: 'widget',
        title: 'Widget',
        type: 'collapse',
        icon: 'feather icon-layers',
        badge: {
          title: '100+',
          type: 'badge-success'
        },
        children: [
          {
            id: 'statistic',
            title: 'Statistic',
            type: 'item',
            url: '/widget/statistic'
          },
          {
            id: 'data',
            title: 'Data',
            type: 'item',
            url: '/widget/data'
          },
          {
            id: 'chart',
            title: 'Chart',
            type: 'item',
            url: '/widget/chart'
          }
        ]
      }
    ]
  },
  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'feather icon-layers',
    children: [
      {
        id: 'basic',
        title: 'Basic',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'alert',
            title: 'Alert',
            type: 'item',
            url: '/basic/alert'
          },
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/basic/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumbs & Pagination',
            type: 'item',
            url: '/basic/breadcrumb-paging'
          },
          {
            id: 'cards',
            title: 'Cards',
            type: 'item',
            url: '/basic/cards'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/basic/collapse'
          },
          {
            id: 'carousel',
            title: 'Carousel',
            type: 'item',
            url: '/basic/carousel'
          },
          {
            id: 'grid-system',
            title: 'Grid System',
            type: 'item',
            url: '/basic/grid-system'
          },
          {
            id: 'progress',
            title: 'Progress',
            type: 'item',
            url: '/basic/progress'
          },
          {
            id: 'modal',
            title: 'Modal',
            type: 'item',
            url: '/basic/modal'
          },
          {
            id: 'spinner',
            title: 'Spinner',
            type: 'item',
            url: '/basic/spinner'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/basic/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/basic/typography'
          },
          {
            id: 'tooltip-popovers',
            title: 'Tooltip & Popovers',
            type: 'item',
            url: '/basic/tooltip-popovers'
          },
          {
            id: 'toasts',
            title: 'Toasts',
            type: 'item',
            url: '/basic/toasts'
          },
          {
            id: 'other',
            title: 'Other',
            type: 'item',
            url: '/basic/other'
          }
        ]
      },
      {
        id: 'advance',
        title: 'Advance',
        type: 'collapse',
        icon: 'feather icon-gitlab',
        children: [
          {
            id: 'sweet-alert',
            title: 'Sweet Alert',
            type: 'item',
            url: '/advance/alert'
          },
          /*{
            id: 'datepicker',
            title: 'Datepicker',
            type: 'item',
            url: '/advance/datepicker'
          },*/
          {
            id: 'task-board',
            title: 'Task Board',
            type: 'item',
            url: '/advance/task-board'
          },
          {
            id: 'light-box',
            title: 'Light Box',
            type: 'item',
            url: '/advance/light-box'
          },
          {
            id: 'notification',
            title: 'Notification',
            type: 'item',
            url: '/advance/notification'
          },
          {
            id: 'rating',
            title: 'Rating',
            type: 'item',
            url: '/advance/rating'
          },
          {
            id: 'range-slider',
            title: 'Range Slider',
            type: 'item',
            url: '/advance/range-slider'
          },
        ]
      }
    ]
  },
  {
    id: 'forms',
    title: 'Forms',
    type: 'group',
    icon: 'feather icon-layout',
    children: [
      {
        id: 'forms-element',
        title: 'Forms',
        type: 'collapse',
        icon: 'feather icon-file-text',
        children: [
          {
            id: 'form-elements',
            title: 'Form Elements',
            type: 'item',
            url: '/forms/basic'
          },
          {
            id: 'form-elements',
            title: 'Form Advance',
            type: 'item',
            url: '/forms/advance'
          },
          {
            id: 'form-validation',
            title: 'Form Validation',
            type: 'item',
            url: '/forms/validation'
          },
          {
            id: 'form-masking',
            title: 'Form Masking',
            type: 'item',
            url: '/forms/masking'
          },
          {
            id: 'form-wizard',
            title: 'Form Wizard',
            type: 'item',
            url: '/forms/wizard'
          },
          {
            id: 'form-picker',
            title: 'Form Picker',
            type: 'item',
            url: '/forms/picker'
          },
          {
            id: 'form-select',
            title: 'Form Select',
            type: 'item',
            url: '/forms/select'
          }
        ]
      }
    ]
  },
  {
    id: 'extension',
    title: 'Extension',
    type: 'group',
    icon: 'feather icon-cpu',
    children: [
      {
        id: 'editor',
        title: 'Editor',
        type: 'collapse',
        icon: 'feather icon-file-plus',
        children: [
          {
            id: 'tinymce-editor',
            title: 'Tinymce Editor',
            type: 'item',
            url: '/editor/tinymce'
          },
          {
            id: 'pell-wysiwyg',
            title: 'Pell WYSIWYG',
            type: 'item',
            url: '/editor/wysiwyg'
          }
        ]
      },
      {
        id: 'invoice',
        title: 'Invoice',
        type: 'collapse',
        icon: 'feather icon-file-minus',
        children: [
          {
            id: 'invoice-basic',
            title: 'Invoice Basic',
            type: 'item',
            url: '/invoice/basic'
          },
          {
            id: 'invoice-summary',
            title: 'Invoice Summary',
            type: 'item',
            url: '/invoice/summary'
          },
          {
            id: 'invoice-list',
            title: 'Invoice List',
            type: 'item',
            url: '/invoice/list'
          }
        ]
      },
      {
        id: 'full-calendar',
        title: 'Full Calendar',
        type: 'item',
        url: '/full-calendar',
        classes: 'nav-item',
        icon: 'feather icon-calendar'
      },
      {
        id: 'file-upload',
        title: 'File Upload',
        type: 'item',
        url: '/file-upload',
        classes: 'nav-item',
        icon: 'feather icon-upload-cloud'
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
    icon: 'feather icon-aperture'
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
        icon: 'feather icon-calendar'
      },
      {
        id: 'export-raw',
        title: 'นำออกวัตถุดิบ',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/export-raw',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'main-data',
    title: 'ข้อมูลหลัก',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'product',
        title: 'สินค้า',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/product',
        classes: 'nav-item'
      },
      {
        id: 'raw-material',
        title: 'วัตถุดิบ',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/raw-material',
        classes: 'nav-item'
      },
      {
        id: 'unit',
        title: 'หน่วยนับ',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/uom',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'report',
    title: 'รายงาน',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'stock-movement',
        title: 'รายงานการเข้าออกวัตถุดิบ',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/stock-movement',
        classes: 'nav-item'
      },
      {
        id: 'net-profit',
        title: 'รายงานสรุปยอดขาย',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/net-profit',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'user-management',
    title: 'ผู้ใช้งาน',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'user',
        title: 'ผู้ใช้งาน',
        type: 'item',
        icon: 'feather icon-users',
        url: '/user',
        classes: 'nav-item'
      },
      {
        id: 'role',
        title: 'กลุ่มผู้ใช้งาน',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/role',
        classes: 'nav-item'
      },
      {
        id: 'permission',
        title: 'สิทธิ์การเข้าใช้งาน',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/permission',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'shop-management',
    title: 'การจัดการร้านค้า',
    type: 'group',
    icon: 'feather icon-users',
    children: [
      {
        id: 'shop',
        title: 'ร้านค้า',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/shop',
        classes: 'nav-item'
      },
      {
        id: 'branch',
        title: 'สาขา',
        type: 'item',
        icon: 'feather icon-file-text',
        url: '/branch',
        classes: 'nav-item'
      }
    ]
  }
];


@Injectable()
export class NavigationItem {
  public get() {
    if (Role == "Admin") {
      return NavigationItemsAdmin;
    } else {
      return NavigationItemsManager;
    }

  }
}
