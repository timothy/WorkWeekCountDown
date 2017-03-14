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
  lunchTime?: {h:number, m:number};
}

export {TotalTime, DayTimeTracker}
