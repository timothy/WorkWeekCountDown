import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
//
import {TotalTime} from "./types";
import {ISOTime} from "../../classes/ISOTime";

enum T {hour, min}//used when time is split

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  readonly DOW: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly week: number = 7;
  oldTime: string[] = [];

  //---variables below are used in the view---
  days: Array<any> = [];
  time: TotalTime = {decimal: 40, hhmm: '40:00'};

  constructor(public navCtrl: NavController) {
    console.log(navCtrl);
    for (let i = 0; i < this.week; i++) {
      this.days.push({day: this.DOW[i], hhmm: null, decimalTime: null, index: i});
      this.oldTime.push('');
    }
  }

  /**
   * This will calculate decimal time and hr/min time based on decimal input
   * and will update all other field to reflect this new time
   */
  calcDecTime(index: number) {
    //clear start and end times... does not make sense to keep them user manually inputs time amount
    this.days[index].endDate = null;
    this.days[index].startDate = null;

    this.days[index].hhmm = ISOTime.Dec2ISO(this.days[index].decimalTime);

    console.log(this.days[index].decimalTime);
    console.log("this.days[index].decimalTime");

    //Calculate end totals with new subtracted amount
    this.calcEndTotals(index);
  }

  /**
   * This will calculate decimal time and hr/min time based on hr/min input
   * and will update all other field to reflect this new time
   * @param index the index of the day array that is to be edited
   */
  CalcTime(index: number) {

    //clear start and end times... does not make sense to keep them user manually inputs time amount
    this.days[index].endDate = null;
    this.days[index].startDate = null;

    this.days[index].decimalTime = ISOTime.ISO2Dec(this.days[index].hhmm);

    console.log(this.days[index].hhmm);
    console.log("this.days[index].hhmm");

    //Calculate end totals with new subtracted amount
    this.calcEndTotals(index);
  }

  /**
   * This will calculate the amount of time between the start and end time boxes
   * and will update all other field to reflect this new time
   * @param index the index of the day array that is to be edited
   */
  calcStartEndTime(index: number) {
    let totalHR: any;
    let totalMN: any;
    let start: number[];
    let end: number[];

    if (this.days[index].startDate && this.days[index].endDate) {
      start = ISOTime.SplitTime(this.days[index].startDate);
      end = ISOTime.SplitTime(this.days[index].endDate);

      console.log(start);
      console.log(end);

      //if start time is less then end time
      if (start[T.hour] < end[T.hour] || (start[T.hour] === end[T.hour] && start[T.min] < end[T.min])) {
        console.log("++++++++++++++++++++++++++Validation***************************");

        //if start min is more then end min then one hour needs to be subtracted from end
        if (end[T.hour] > start[T.hour] && end[T.min] < start[T.min]) {
          totalHR = (end[T.hour] - 1) - start[T.hour];
          totalMN = (end[T.min] + 60) - start[T.min];
        } else {
          totalHR = end[T.hour] - start[T.hour];
          totalMN = end[T.min] - start[T.min];
        }

        console.log(totalHR + ':' + totalMN);

        let isoTime: string = ISOTime.HrMn2ISOFormat(totalHR, totalMN);

        //calc all
        console.log(isoTime);
        this.days[index].hhmm = isoTime;
        this.days[index].decimalTime = ISOTime.ISO2Dec(isoTime);

        //Calc end totals
        this.calcEndTotals(index);
        
      } else {//TODO: give user notification
        this.days[index].endDate = null;
        this.days[index].startDate = null;
      }
    }
  }


  /**
   * Calculate end totals. If there is a previous amount then overwrite it with new amount
   * @param index the index of the day array that is to be edited
   */
  calcEndTotals(index: number) {
    if (this.oldTime[index]) {
      this.time.decimal += ISOTime.ISO2Dec(this.oldTime[index]);
      this.time.hhmm = ISOTime.addISO(this.time.hhmm, this.oldTime[index]);
    }
    this.time.decimal -= ISOTime.ISO2Dec(this.days[index].hhmm);
    this.time.hhmm = ISOTime.subISO(this.time.hhmm, this.days[index].hhmm);

    this.oldTime[index] = this.days[index].hhmm;
  }

}
