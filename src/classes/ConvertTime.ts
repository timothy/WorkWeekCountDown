/**
 * Created by Timothy on 12/16/2016.
 */
//import {Validate} from "./NumValidator";// no longer needed - user input is validated in view now

/**
 * Using this class to convert times will make it easier to change conversion formulas
 * changing the formaula here will change it every where it is used.
 */
export class ConvertTime {

  static readonly milliMin: number = 60 * 1000;
  static readonly milliHour: number = 60 * ConvertTime.milliMin;

  /**
   * This will convert hours and min from their millisecond form to decimal form
   * @param hours milliseconds that represent the hour amount of time
   * @param min milliseconds that represent the minute amount of time
   * @returns {number} a decimal number that represents both minutes and hours
   * @constructor
   */
  static HourMin2Dec(hours: number, min: number): number {
    //hours = Validate.Integer(hours);// no longer needed - user input is validated in view now
    //min = Validate.Integer(min);// no longer needed - user input is validated in view now
    return ((hours * this.milliHour) + (min * this.milliMin)) / this.milliHour;
  }

  /**
   * This will convert milliseconds into decimal form
   * @param milliSec an amount of time that is represented by milliseconds
   * @returns {number} an amount of time that is represented by a decimal number
   * @constructor
   */
  static MiliSec2Dec(milliSec: number): number {//todo add validation
    return milliSec / this.milliHour;
  }

  /**
   * this will convert a decimal number into its hour amount and drop
   * the remaining min amount
   * @param decimalTime
   * @returns {number}
   * @constructor
   */
  static Dec2Hour(decimalTime: number): number {
    //decimalTime = Validate.Decimal(decimalTime);// no longer needed - user input is validated in view now
    return Math.floor(decimalTime);
  }

  /**
   * this will convert a decimal number into its minute form.
   * Note: this function view only the fraction amount as minutes. Any whole numbers will be dropped
   * @param decimalTime
   * @returns {number}
   * @constructor
   */
  static Dec2Min(decimalTime: number): number {//TODO round to the nearest whole number...
    //decimalTime = Validate.Decimal(decimalTime);// no longer needed - user input is validated in view now
    return Math.round((decimalTime - Math.floor(decimalTime)) * 60);//might want to start rounding to nearest min instead of dropping remainder...

    //or maybe: return Math.floor(decimalTime * 60) % 60;
    //or maybe: return Math.floor(((decimalTime * this.milliHour) % this.milliHour)/this.milliMin);
  }

  /**
   *
   * @param decimalTime {number} a decimal number that represents hours and min
   * @returns {string} returns ISO time 'hh:mm' i.e. '05:09'
   * @constructor
   */
  static Dec2IsoStrTime(decimalTime: number): string {
    let hour: any = this.Dec2Hour(decimalTime);
    let min: any = this.Dec2Min(decimalTime);

    return this.HrMn2ISOFormat(hour, min);
  }

  /**
   *
   * @param hour the amount of hours. Needs to be either string number or number
   * @param min the amount of min. Needs to be either string number or number
   * @returns {string} returns ISO time 'hh:mm' i.e. '05:09'
   * @constructor
   */
  static HrMn2ISOFormat(hour: any, min: any): string {
    if (hour.toString().length === 1) {
      hour = '0' + hour.toString();
    }
    //needs to be 2 digits
    if (min.toString().length === 1) {
      min = '0' + min.toString();
    }

    return hour + ':' + min;
  }
}
