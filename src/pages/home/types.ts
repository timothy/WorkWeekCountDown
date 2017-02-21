/**
 * Created by Timothy on 12/7/2016.
 */
interface TotalTime {
  decimal: number;
  hhmm: string;
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
