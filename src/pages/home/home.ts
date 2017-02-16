import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
//
import {TotalTime} from "./types";
//import {Validate} from "../../classes/NumValidator";
import {ConvertTime} from "../../classes/ConvertTime";

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
    for (let i = 0; i < this.week; i++) {
      this.days.push({day: this.DOW[i], hm: 0, decimalTime: 0, index: i});
      this.oldTime.push(0);
    }
  }

  /**
   * This will calculate decimal time and hr/min time based on decimal input
   * and will update all other field to reflect this new time
   */
  calcDecTime(index) {
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
  CalcTime(index) {
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
  calcStartEndTime(index) {
    console.log(this.days[index].startDate);
    console.log(this.days[index].endDate);
    console.log("Start and End Dates");
    //make sure there is information in both "start" and "end" sections before trying to work with it.
    if (this.days[index].endDate && this.days[index].startDate && this.days[index].endDate.getTime() > this.days[index].startDate.getTime()) {
      console.log("Start and End Dates are Valid!!!");
      //find out how many milliseconds are between start and end times
      //let result: number = this.days[index].endDate.getTime() - this.days[index].startDate.getTime();

      //update all other fields - based on new start and end times
      //this.days[index].decimalTime = ConvertTime.MiliSec2Dec(result);
      //this.days[index].hours = ConvertTime.Dec2Hour(this.days[index].decimalTime);
      //this.days[index].min = ConvertTime.Dec2Min(this.days[index].decimalTime);

      //this.calcEndTotals(index);
    }
  }


  /**
   * Calculate end totals. If there is a previous amount then overwrite it with new amount
   * @param index the index of the day array that is to be edited
   */
  calcEndTotals(index) {
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
