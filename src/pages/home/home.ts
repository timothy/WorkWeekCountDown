import {Component} from '@angular/core';
import {AlertController} from 'ionic-angular';
//
import {TotalTime, DayTimeTracker} from "./types";
import {ISOTime} from "../classes/ISOTime";

enum T {hour, min}//used when time is split

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  readonly DOW: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  readonly week: number = 7;
  oldTime: number[];
  styleCount: number = 0;

  //---variables below are used in the view---
  days: Array<DayTimeTracker> = [];
  time: TotalTime = {decimal: Number(40), hhmm: '40:00'};
  LunchDisplay: string[] = [];

  constructor(public alertCtrl: AlertController) {
    for (let i = 0; i < this.week; i++) {
      this.days.push({
        day: this.DOW[i],
        hhmm: null,
        decimalTime: null,
        index: i,
        lunchTime: {cur: 0, old: 0, timeChange: false}
      });
      this.LunchDisplay.push("Add Lunch");
    }
    this.oldTime = new Array(this.week);
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

    this.days[index].decimalTime = Number(ISOTime.ISO2Dec(this.days[index].hhmm));

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

        let isoTime: string = ISOTime.subISO(this.days[index].endDate, this.days[index].startDate);//should always result in a positive number

        //calc other fields
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

  /**
   * Handles add lunch button logic
   * @param index the index of the day array that is to be edited
   */
  addLunchTime(index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Subtract Lunch Break',
      message: "Subtract lunch time from total hours worked.",
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
            //Do nothing for now
          }
        },
        {
          text: 'Save',
          handler: data => {
            let lunchD: number = ISOTime.HourMin2Dec(data.h, data.m);

            //Lunch needs to be a positive number
            if (lunchD > 0) {
              this.days[index].lunchTime.timeChange = true;//there are changes

              // save state of old lunch before adding new time.
              if (this.days[index].lunchTime.cur > 0) {
                this.days[index].lunchTime.old = this.days[index].lunchTime.cur;
              }

              //Only calculate if user already added time
              if (this.days[index].decimalTime || this.days[index].decimalTime === 0) {
                this.days[index].lunchTime.cur = lunchD;
                this.calcEndTotals(index);
              } else {
                this.days[index].lunchTime.cur = lunchD;
              }
              this.LunchDisplay[index] = ISOTime.Dec2ISO(lunchD, true);
            }
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
      this.time.decimal = Number(this.oldTime[index]) + Number(this.time.decimal);// having problems with this turing into a string and concatenating it. To ovoid this problem used Number()
    }

    //Factor in lunch time changes
    if (this.days[index].lunchTime.timeChange) {
      if (this.days[index].lunchTime.old > 0) {
        this.time.decimal = Number(this.time.decimal) - Number(this.days[index].lunchTime.old);
      }

      if (this.days[index].lunchTime.cur > 0) {
        this.time.decimal = Number(this.time.decimal) + Number(this.days[index].lunchTime.cur);
      }
      this.days[index].lunchTime.timeChange = false;//all changes complete
    }


    this.time.decimal = Number(this.time.decimal) - Number(this.days[index].decimalTime);
    this.time.hhmm = ISOTime.Dec2ISO(this.time.decimal, true);

    this.oldTime[index] = Number(this.days[index].decimalTime);
  }

  /**
   * Clear all data fields and start over
   */
  clearAll() {
    let confirm = this.alertCtrl.create({
      title: 'Clear all data?',
      message: 'Are you sure you want to clear all data?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.days = [];
            this.LunchDisplay = [];
            this.oldTime = new Array(this.week);
            this.time = {decimal: 40, hhmm: '40:00'};

            for (let i = 0; i < this.week; i++) {
              this.days.push({
                day: this.DOW[i],
                hhmm: null,
                decimalTime: null,
                index: i,
                lunchTime: {cur: 0, old: 0, timeChange: false}
              });
              this.LunchDisplay.push("Add Lunch");
            }
          }
        }
      ]
    });
    confirm.present();
  }

  //This needs to be implemented to handle custom views and layouts for different devices
  /*  setStyles() {
      const DOWColors: string[] = ['#642e90', '#283591', '#1c65b2', '#0ba3c8', 'green', '#8cc63e', '#f3ec18'];

      let styles = {
        'background-color': DOWColors[this.styleCount++]
      };

      return styles;
    }*/
}
