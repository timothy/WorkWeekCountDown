/**
 * Created by Timothy on 2/21/2017.
 */
/**
 * this class is to handle hh:mm time format and is meant to work with the ionic datetime component.
 * I am using the datetime component to calculate time and not to show dates and times. In order
 * to do this I have built this class to handle most of the needed time calculations that are not
 * built into the ionic datetime component
 */
export class ISOTime {

  static readonly hour: number = 0;
  static readonly min: number = 1;

  static readonly milliMin: number = 60 * 1000;
  static readonly milliHour: number = 60 * ISOTime.milliMin;

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
    return Number(milliSec) / Number(this.milliHour);
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
    //return Math.floor(decimalTime);//this does not work with negative numbers...
    return Math.trunc(decimalTime);
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
    return Math.round((Number(decimalTime) - Math.trunc(decimalTime)) * 60);//might want to start rounding to nearest min instead of dropping remainder...

    //or maybe: return Math.trunc(decimalTime * 60) % 60;
    //or maybe: return Math.trunc(((decimalTime * this.milliHour) % this.milliHour)/this.milliMin);
  }


  /**
   * Designed to handle negative/positive numbers
   * @param hour the amount of hours. Needs to be either string number or number
   * @param min the amount of min. Needs to be either string number or number
   * @returns {string} returns ISO time 'hh:mm' i.e. '05:09'
   * @constructor
   */
  static HrMn2ISOFormat(hour: any, min: any): string {
    hour = hour.toString();
    min = min.toString();

    //needs to be 2 digits - looks better
    if (min.length === 1) {
      min = '0' + min;
    }

    if (min[0] === '-' && min.length === 2) {
      min = '0' + min[1];

      if (hour[0] !== '-') {
        hour = '-' + hour;
      }
    }

    if (min[0] === '-' && min.length > 2) {
      min = min.substring(1, min.length);

      if (hour[0] !== '-') {
        hour = '-' + hour;
      }
    }

    return hour + ':' + min;
  }

  /**
   * ISO Time is in the format of hh:mm i.e. '05:09'
   * this method will convert ISO time into decimal time so from 05:09 to 5.15
   * @param hhmm {string} ISO format string hh:mm i.e. '05:09'
   * @returns {number} time in decimal format 5.15
   * @constructor
   */
  static ISO2Dec(hhmm: string): number {
    let time: any[] = this.SplitTime(hhmm);
    return Number(time[this.hour]) + Number(time[this.min]) / 60;
  }

  /**
   *
   * @param decimalTime {number} a decimal number that represents hours and min
   * @param isEndTotal {boolean} if end totals then data needs to be parsed in hh:mm format
   * @returns {string} returns ISO time 'hh:mm' i.e. '05:09'
   * @constructor
   */
  static Dec2ISO(decimalTime: number, isEndTotal:boolean = false): string {
    if(isEndTotal){
      return this.HrMn2ISOFormat(this.Dec2Hour(decimalTime), this.Dec2Min(decimalTime))
    }
    return this.toFullISOstring(this.Dec2Hour(decimalTime), this.Dec2Min(decimalTime));
  }

  /**
   * @param hr the amount of hours. Needs to be either string number or number
   * @param min the amount of min. Needs to be either string number or number
   * @returns {string} A string in full ISO time format
   */
  static toFullISOstring(hr,min): string{
    let d = new Date();
    d.setUTCHours(Number(hr));
    d.setUTCMinutes(Number(min));
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    return d.toISOString();
  }
  /**
   * add two ISO times together
   * @param iso1
   * @param iso2
   * @returns {string} new ISO time string: sum of iso1 + iso2
   */
  static addISO(iso1: string, iso2: string): string {
    let time1: any[] = this.SplitTime(iso1);
    let time2: any[] = this.SplitTime(iso2);

    let totalH: number;
    let totalM: number;

    // 00:55 + 00:06 === 01:01 NOT 00:61
    let positiveCondition: boolean = Number(time1[this.min]) + Number(time2[this.min]) >= 60;
    // -05:-05 + 00:10 === -04:-55 NOT -05:05
    let negativeCondition: boolean = Number(time1[this.hour]) + Number(time2[this.hour]) < 0 && Number(time1[this.min]) + Number(time2[this.min]) > 0;

    if (positiveCondition || negativeCondition) {
      totalH = Number(time1[this.hour]) + Number(time2[this.hour]) + 1;
      totalM = (Number(time1[this.min]) + Number(time2[this.min])) - 60;
    } else {
      totalH = Number(time1[this.hour]) + Number(time2[this.hour]);
      totalM = Number(time1[this.min]) + Number(time2[this.min]);
    }

    return this.HrMn2ISOFormat(totalH, totalM);
  }

  /**
   * subtracts two ISO times
   * @param iso1 subtracting from
   * @param iso2 the amount that will be subtracted
   * @param isEndTotal {boolean} - true if you want a simple time string. False if you want full iso datetime string.
   * @returns {string} new ISO time string: remainder of iso1 - iso2
   */
  static subISO(iso1: string, iso2: string, isEndTotal:boolean = false): string {
    let time1: number[] = this.SplitTime(iso1);
    let time2: number[] = this.SplitTime(iso2);

    let totalH: number;
    let totalM: number;

    //if number outcome is positive - if time2 min is more then time1 min then one hour needs to be subtracted and 60 min added
    //if 01:50 - 00:55 === 00:55 NOT 01:-05
    let positiveCondition: boolean = Number(time1[this.min]) < Number(time2[this.min]) && Number(time1[this.hour]) - Number(time2[this.hour]) > 0;
    //if 01:15 - 05:20 === 00:-55 NOT -01:-05
    let negativeCondition: boolean = Number(time1[this.min]) - Number(time2[this.min]) <= -60 && Number(time1[this.hour]) - Number(time2[this.hour]) <= 0;
    // if 39:01 - 40:00 === 00:-01 NOT -01:01
    let negativeCondition2: boolean = Number(time1[this.min]) > Number(time2[this.min]) && Number(time1[this.hour]) < Number(time2[this.hour]);

    //account for 60 min time cycle
    if (positiveCondition || negativeCondition) {
      totalH = (Number(time1[this.hour]) - 1) - Number(time2[this.hour]);
      totalM = (Number(time1[this.min]) + 60) - Number(time2[this.min]);
    } else if (negativeCondition2) {
      totalH = (Number(time1[this.hour]) + 1) - Number(time2[this.hour]);
      totalM = (Number(time1[this.min]) - 60) - Number(time2[this.min]);
    } else {
      totalH = Number(time1[this.hour]) - Number(time2[this.hour]);
      totalM = Number(time1[this.min]) - Number(time2[this.min]);
    }

    if(isEndTotal){
      return this.HrMn2ISOFormat(totalH, totalM);
    }

    return this.toFullISOstring(totalH, totalM);
  }

  /**
   * separate time into an array of hours and min
   * hours === 0 position in array and min === 1
   * @param iso
   * @returns {string[]}
   * Note: this is an easy way of changing how to split the hours and min...
   * if the time string changes in the future to hh-mm or anything else all we need
   * to do is change below code and changes will be reflected throughout the app.
   */
  static SplitTime(iso: string): number[] {
    let temp;
    if(iso.indexOf('T') !== -1){
      temp = iso.split("T");
      temp = temp[1].split(":");
    }else{
      temp = iso.split(":");
    }

    let numArr: number[] = [];

    //order matters... to avoid confusion omitted this.hour...
    numArr.push(Number(temp[0]));
    numArr.push(Number(temp[1]));

    return numArr;
  }



}
