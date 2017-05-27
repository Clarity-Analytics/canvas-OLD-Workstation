// Service to provide date formats
import { Injectable }                 from '@angular/core';

var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

@Injectable()
export class CanvasDate {

    daysOfWeek(): string[]{
        // Returns an array with the days of the week
        return weekday;
    }

    weekDay(daynumber: number ) {
        // Return the day of the week, where Sunday = day 0
        return weekday[daynumber];
    }

    dayOfWeek(date: Date): string {
        return weekday[ (date.getDay() % 7) ];
    }

 	dayOfMonth(date: Date): number {
         return date.getDate();
     }

 	months(): string[] {
         return months;
     }

 	curMonth(date: Date) {
         return months[date.getMonth()];
     }

 	curYear(date: Date) {
         return date.getFullYear();
     }

 	curHour(date: Date) {
         return date.getHours();
     }

 	curMinute(date: Date) {
         return date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
     }

 	curSeconds(date: Date) {
         return  date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
     }
 	curMeridiem(date: Date) {
         return  date.getHours() > 12 ? "PM" : "AM";
     }
 	today(format: string): string {
         if (format == 'locale') {
            let datum = new Date();
            return datum.toLocaleDateString().toString();
         } else if (format = 'standard') {
            let datum = new Date();
            return datum.getFullYear().toString() + '/' + 
                   (  (datum.getMonth() < 10) ? 
                        '0' + (datum.getMonth() + 1).toString() : 
                   (datum.getMonth() + 1).toString() ) + '/' +
                   (  (datum.getDate() < 10) ?
                        '0' + datum.getDate().toString() :
                        datum.getDate().toString() ) ;
         } 
     }
 	now(format: string): string {
        let datum = new Date();
        return this.today(format) + ' ' +
                this.curHour(datum).toString() + ':' + 
                this.curMinute(datum).toString();
    } 

}