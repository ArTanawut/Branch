import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { formatDate } from '@angular/common';

import { CalendarOptions } from '@fullcalendar/angular';

@Component({
  selector: 'app-full-event-calendar',
  templateUrl: './full-event-calendar.component.html',
  styleUrls: ['./full-event-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FullEventCalendarComponent implements OnInit {
  dateObj = new Date();
  yearMonth = this.dateObj.getUTCFullYear() + '-' + (this.dateObj.getUTCMonth() + 1);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [
      {
        title: 'All Day Event',
        start: formatDate(this.yearMonth + '-01', 'yyyy-MM-dd', 'en-US'),
        borderColor: '#04a9f5',
        backgroundColor: '#04a9f5',
        textColor: '#fff'
      },
      {
        title: 'Long Event',
        start: formatDate(this.yearMonth + '-07', 'yyyy-MM-dd', 'en-US'),
        end: formatDate(this.yearMonth + '-10', 'yyyy-MM-dd', 'en-US'),
        borderColor: '#f44236',
        backgroundColor: '#f44236',
        textColor: '#fff'
      },
      {
        id: '999',
        title: 'Repeating Event',
        start: formatDate(this.yearMonth + '-09 09:00:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        borderColor: '#f4c22b',
        backgroundColor: '#f4c22b',
        textColor: '#fff'
      },
      {
        id: '1000',
        title: 'Repeating Event',
        start: formatDate(this.yearMonth + '-16 08:00:00 AM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        borderColor: '#3ebfea',
        backgroundColor: '#3ebfea',
        textColor: '#fff'
      },
      {
        title: 'Conference',
        start: formatDate(this.yearMonth + '-11', 'yyyy-MM-dd', 'en-US'),
        end: formatDate(this.yearMonth + '-13', 'yyyy-MM-dd', 'en-US'),
        borderColor: '#1de9b6',
        backgroundColor: '#1de9b6',
        textColor: '#fff'
      },
      {
        title: 'Meeting',
        start: formatDate(this.yearMonth + '-12 10:00:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        end: formatDate(this.yearMonth + '-12 12:30:00 AM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        textColor: '#fff'
      },
      {
        title: 'Lunch',
        start: formatDate(this.yearMonth + '-12 12:00:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        borderColor: '#f44236',
        backgroundColor: '#f44236',
        textColor: '#fff'
      },
      {
        title: 'Meeting',
        start: formatDate(this.yearMonth + '-12 02:30:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        textColor: '#fff'
      },
      {
        title: 'Happy Hour',
        start: formatDate(this.yearMonth + '-12 05:30:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        borderColor: '#a389d4',
        backgroundColor: '#a389d4',
        textColor: '#fff'
      },
      {
        title: 'Dinner',
        start: formatDate(this.yearMonth + '-12 08:00:00 PM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        textColor: '#fff'
      },
      {
        title: 'Birthday Party',
        start: formatDate(this.yearMonth + '-13 07:30:00 AM', 'yyyy-MM-dd hh:mm:ss', 'en-US'),
        textColor: '#fff'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: formatDate(this.yearMonth + '-28', 'yyyy-MM-dd', 'en-US'),
        borderColor: '#a389d4',
        backgroundColor: '#a389d4',
        textColor: '#fff'
      }
    ]
  };

  ngOnInit() {}
}
