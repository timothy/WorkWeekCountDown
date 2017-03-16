/**
 * Created by Timothy on 12/7/2016.
 */
interface TotalTime {
  decimal: number;
  hhmm: string;
}

interface DayTimeTracker {
  day: string;
  hhmm: string;
  decimalTime: number;
  index:number;
  startDate?: string;
  endDate?: string;
  lunchTime: {cur:number, old:number, timeChange:boolean};
}

export {TotalTime, DayTimeTracker}
