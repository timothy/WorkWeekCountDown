import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
//
import {TotalTime} from "./types";
//import {Validate} from "../../classes/NumValidator";
import {ConvertTime} from "../../classes/ConvertTime";

enum T { hr, min }

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  readonly DOW: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly week: number = 7;
  oldTime: number[] = [];

  //---variables below are used in the view---
  days: Array<any> = [];
  time: TotalTime = {decimal: 40, hours: 40, min: 0};

  constructor(public navCtrl: NavController) {
    console.log(navCtrl);
    for (let i = 0; i < this.week; i++) {
      this.days.push({day: this.DOW[i], hm: 0, decimalTime: 0, index: i});
      this.oldTime.push(0);
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

    console.log(this.days[index].decimalTime);
    console.log("this.days[index].decimalTime");

    //Calculate end totals with new subtracted amount
    //this.calcEndTotals(index);
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

    console.log(this.days[index].hm);
    console.log("this.days[index].hm");
    //this.days[index].hm.split("");

    //Calculate end totals with new subtracted amount
    //this.calcEndTotals(index);
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
      start = this.days[index].startDate.split(":");
      end = this.days[index].endDate.split(":");

      console.log(start);
      console.log(end);
      //if start time is less then end time
      if (start[T.hr] < end[T.hr] || (start[T.hr] === end[T.hr] && start[T.min] < end[T.min])) {
        console.log("++++++++++++++++++++++++++Validation***************************");

        //if start min is more then end min then one hour needs to be subtracted from end
        if (end[T.hr] > start[T.hr] && end[T.min] < start[T.min]) {
          totalHR = (end[T.hr] - 1) - start[T.hr];
          totalMN = (end[T.min] + 60) - start[T.min];
        } else {
          totalHR = end[T.hr] - start[T.hr];
          totalMN = end[T.min] - start[T.min];
        }

        console.log(totalHR + ':' + totalMN);
        //needs to be 2 digits
        if (totalHR.toString().length === 1) {
          totalHR = 0 + totalHR.toString();
        }
        //needs to be 2 digits
        if (totalMN.toString().length === 1) {
          totalMN = 0 + totalMN.toString();
        }

        //calc all
        console.log(totalHR + ':' + totalMN);
        this.days[index].hm = totalHR + ':' + totalMN;
        this.days[index].decimalTime = ConvertTime.HourMin2Dec(Number(totalHR),Number(totalMN));
        //TODO: Calc end totals

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
      this.time.decimal += this.oldTime[index];
      this.time.hours = ConvertTime.Dec2Hour(this.time.decimal);
      this.time.min = ConvertTime.Dec2Min(this.time.decimal);
    }
    this.time.decimal -= this.days[index].decimalTime;
    this.time.hours = ConvertTime.Dec2Hour(this.time.decimal);
    this.time.min = ConvertTime.Dec2Min(this.time.decimal);

    this.oldTime[index] = this.days[index].decimalTime;
  }

}
