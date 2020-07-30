import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  isHtml5TimeInFuture(dayStr:string, timeStr:string) {
    var date1 = this.dateFromHtml5Time(dayStr, timeStr);
    var now = new Date();
    var diff = this.diffBetweenTwoDates(date1, now);
    return diff > 0;
  }
  daysTillDate(dateStr:string) {
    var date1 = new Date(dateStr);
    var now = new Date();
    var diff = this.diffBetweenTwoDates(date1, now);
    var days = Math.ceil(diff / 1000 / 86400);
    return days;
  }
  minutesBetween2DateStamps(dateStr1:string, dateStr2:string) {
    var date1 = new Date(dateStr1);
    var date2 = new Date(dateStr2);
    var diff = this.diffBetweenTwoDates(date2, date1);
    return Math.ceil(diff / 1000 / 60);
  }
  diffBetweenTwoDates(date1:Date, date2:Date) {
    return date1.getTime() - date2.getTime();
  }
  dateFromHtml5Time(dayStr:string, timeStr:string) {
    return new Date(dayStr + ' ' + timeStr);
  }
  localTimeFromStamp(dateStamp:string) {
    return this.dateComponentFromDateStamp(dateStamp, true, true);
  }
  weekdayOfDate(dateStamp:string) {
    var dateSt = new Date();
    if (dateStamp)
      dateSt = new Date(dateStamp);

    var day = dateSt.getDay();
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }
  timeOfDayOfDate(dateStamp:string) {
    var dateSt = new Date();
    if (dateStamp)
      dateSt = new Date(dateStamp);
    var hour = dateSt.getHours();

    if (hour >= 4 && hour < 12)
      return 'Morning';
    if (hour >= 12 && hour < 5)
      return 'Afternoon';
    if (hour >= 5 && hour < 9)
      return 'Evening';

    return 'Night';
  }
  dateStampFromHtml5Time(dayStr:string, timeStr:string) {
    var now = new Date();
    var hours = Math.floor(now.getTimezoneOffset() / 60);
    var sign = (hours >= 0) ? '-' : '+';
    return dayStr + 'T' + timeStr + ':00' + sign + pad(hours) + ':00';
  }
  oracleDateStampFromDate(date:string='') {
    var dayStr = this.dateComponentFromDateStamp(date);
    var timeStr = this.dateComponentFromDateStamp(date, true);
    return this.dateStampFromHtml5Time(dayStr, timeStr);
  }
  dateComponentFromDateStamp(dateStamp:string, timeFlg = false, localFormatFlg = false) {
    //"2019-05-08T15:00:49-07:00"
    var dateSt = new Date();
    if (dateStamp)
      dateSt = new Date(dateStamp);

    if (typeof dateSt.getMonth === 'function') {
      if (localFormatFlg) {
        if (timeFlg)
          return dateSt.toLocaleDateString() + ' ' + dateSt.toLocaleTimeString();
        else
          return dateSt.toLocaleDateString();
      }

      var year = dateSt.getFullYear();
      var month = pad(dateSt.getMonth() + 1);
      var day = pad(dateSt.getDate());

      var hour = pad(dateSt.getHours());
      var min = pad(dateSt.getMinutes());

      if (timeFlg)
        return hour + ':' + min; //'00:00'
      else
        return year + '-' + month + '-' + day; //'2019-06-15'

    } else {
      console.log('invalid date!!!', dateStamp);
    }
    return dateStamp;
  }
  dateStringFromDate(date:Date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
  clockSinceStartTime(startTime:string) {
    var seconds = this.secondsSinceStartTime(startTime);
    var hours = Math.floor(seconds/3600);
    seconds -= (hours*3600);
    var minutes = Math.floor(seconds/60);
    seconds -= (minutes*60);
    return hours+':'+pad(minutes)+':'+pad(seconds);
  }
  secondsSinceStartTime(startTime:string) {
    var now= new Date();
    var startDate = new Date(startTime);
    var diff = this.diffBetweenTwoDates(now, startDate); 
    return Math.round(diff/1000);
  }

}

function pad(n=0, width=2, z='0') {
  var str = n.toString();
  return str.length >= width ? str : new Array(width - str.length + 1).join(z) + str;
}