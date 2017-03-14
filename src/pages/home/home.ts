import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
//
import {TotalTime, DayTimeTracker} from "./types";
import {ISOTime} from "../../classes/ISOTime";

enum T {hour, min}//used when time is split

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  readonly DOW: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly DOWColors: string[] = ['#5ca793', '#f26722', '#1c65b2', '#0ba3c8', '#21af4b', '#8cc63e', '#ef8b2c'];

  readonly week: number = 7;
  oldTime: number[];
  lunchTime: number[];
  styleCount: number = 0;

  //---variables below are used in the view---
  days: Array<DayTimeTracker> = [];
  time: TotalTime = {decimal: Number(40), hhmm: '40:00'};

  constructor(public navCtrl: NavController, public alertCtrl: AlertController) {
    //console.log(navCtrl);
    for (let i = 0; i < this.week; i++) {
      this.days.push({day: this.DOW[i], hhmm: null, decimalTime: null, index: i, lunchTime: {h: 0, m: 0}});
    }
    this.oldTime = new Array(this.week);
    this.lunchTime = new Array(this.week);
  }

  /**
   * This will calculate decimal time and hr/min time based on decimal input
   * and will update all other field to reflect this new time
   */
  calcDecTime(index: number) {
    if (this.days[index].decimalTime || this.days[index].decimalTime === 0) {
      //clear start and end times... does not make sense to keep them user manually inputs time amount
      this.days[index].endDate = null;
      this.days[index].startDate = null;

      let lunchD: number = ISOTime.HourMin2Dec(this.days[index].lunchTime.h, this.days[index].lunchTime.m);

      //Make sure lunch is a positive number
      if (this.isLuanch(index)) {
        //subtract Lunch time
        this.days[index].decimalTime = this.days[index].decimalTime - lunchD;
      }


      //make sure lunch does not result in a negative work time
      this.days[index].decimalTime = this.days[index].decimalTime > 0 ? this.days[index].decimalTime : 0;

      this.days[index].hhmm = ISOTime.Dec2ISO(Number(this.days[index].decimalTime));

      //Calculate end totals with new subtracted amount
      this.calcEndTotals(index);
    }
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

    let lunchD: number = ISOTime.HourMin2Dec(this.days[index].lunchTime.h, this.days[index].lunchTime.m);
    let decTime: number = Number(ISOTime.ISO2Dec(this.days[index].hhmm));

    //Make sure lunch is a positive number
    if (this.isLuanch(index)) {
      if (Number(decTime - lunchD) > 0) {
        //subtract Lunch time
        this.days[index].hhmm = ISOTime.Dec2ISO(Number(decTime - lunchD));
      } else {
        this.days[index].hhmm = ISOTime.Dec2ISO(0);
      }
    }

    this.days[index].decimalTime = Number(ISOTime.ISO2Dec(this.days[index].hhmm));

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
    //action is only taken when both a start work time and an end work time are provided
    if (this.days[index].startDate && this.days[index].endDate) {
      let start: number[];
      let end: number[];

      start = ISOTime.SplitTime(this.days[index].startDate);
      end = ISOTime.SplitTime(this.days[index].endDate);

      //if start time is less then end time
      if (start[T.hour] < end[T.hour] || (start[T.hour] === end[T.hour] && start[T.min] < end[T.min])) {
        console.log("++++++++++++++++++++++++++Validation***************************");

        let isoTime: string = ISOTime.subISO(this.days[index].endDate, this.days[index].startDate);//should always result in a positive number


        let lunchD: number = ISOTime.HourMin2Dec(this.days[index].lunchTime.h, this.days[index].lunchTime.m);
        let decTime: number = Number(ISOTime.ISO2Dec(isoTime));

        //Make sure lunch is a positive number
        if (this.isLuanch(index)) {
          if (Number(decTime - lunchD) > 0) {
            //subtract Lunch time
            isoTime = ISOTime.Dec2ISO(Number(decTime - lunchD));
          } else {
            isoTime = ISOTime.Dec2ISO(0);
          }
        }
        //calc all
        console.log(isoTime);
        this.days[index].hhmm = isoTime;
        this.days[index].decimalTime = ISOTime.ISO2Dec(isoTime);

        //Calc end totals
        this.calcEndTotals(index);

      } else {//Give user a notification and letting them know their times' do not make sense
        let alert = this.alertCtrl.create({
          title: 'Note:',
          subTitle: 'Your starting time needs to be earlier than your ending Time.',
          buttons: ['OK']
        });
        alert.present();

        this.days[index].endDate = null;
        this.days[index].startDate = null;
      }
    }
  }

  subLunchTime(index) {
    let prompt = this.alertCtrl.create({
      title: 'Subtract Lunch Break',
      message: "Subtract lunch time from this days work.",
      inputs: [
        {
          name: 'h',
          placeholder: 'Hours'
        },
        {
          name: 'm',
          placeholder: 'Min'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            //Only calculate if user already added time
            if (this.days[index].decimalTime || this.days[index].decimalTime === 0) {
              this.days[index].lunchTime = data;
              this.calcDecTime(index);
            } else {
              this.days[index].lunchTime = data;
            }
            console.log(index);
            console.log(this.days[index].decimalTime);
            console.log('Saved clicked');
            console.log(data);
          }
        }
      ]
    });
    prompt.present();
  }


  /**
   * Calculate end totals. If there is a previous amount then overwrite it with new amount
   * @param index the index of the day array that is to be edited
   */
  calcEndTotals(index: number) {
    if (this.oldTime[index]) {
      this.time.decimal = Number(this.oldTime[index]) + Number(this.time.decimal);// having problems with this turing into a string and concatenating it...
      this.time.hhmm = ISOTime.Dec2ISO(this.time.decimal, true);
    }
    this.time.decimal = Number(this.time.decimal) - Number(this.days[index].decimalTime);
    this.time.hhmm = ISOTime.Dec2ISO(this.time.decimal, true);

    this.oldTime[index] = Number(this.days[index].decimalTime);
  }

  clearAll() {
    let confirm = this.alertCtrl.create({
      title: 'Clear all data?',
      message: 'Are you sure you want to clear all data?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.days = [];
            this.oldTime = new Array(this.week);
            this.time = {decimal: 40, hhmm: '40:00'};
            for (let i = 0; i < this.week; i++) {
              this.days.push({day: this.DOW[i], hhmm: null, decimalTime: null, index: i});
            }
          }
        }
      ]
    });
    confirm.present();
  }

  /**
   * Make sure lunch is a positive number
   * @param index
   * @returns {boolean}
   */
  isLuanch(index:number):boolean {
    let lunchM: number = Number(this.days[index].lunchTime.m);
    let lunchH: number = Number(this.days[index].lunchTime.h);

    return (lunchH >= 0 && lunchM >= 0) && (lunchM > 0 || lunchH > 0);
  }

  setStyles() {
    const DOWColors: string[] = ['#642e90', '#283591', '#1c65b2', '#0ba3c8', 'green', '#8cc63e', '#f3ec18'];

    let styles = {
      'background-color': DOWColors[this.styleCount++]
    };

    return styles;
  }
}
