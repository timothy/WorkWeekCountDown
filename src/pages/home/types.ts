/**
 * Created by Timothy on 12/7/2016.
 */
interface TotalTime {
  decimal: number;
  hours: number;
  min: number;
}

interface DayTimeTracker {
  day: string;
  hm: string;
  decimalTime: number;
  index:number;
  startDate?: Date;
  endDate?: Date;
}
export {TotalTime, DayTimeTracker}
