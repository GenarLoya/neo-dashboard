import { DateTime } from "luxon";
import { MAX_DAYS_PER_REQUEST } from "../constants";

export interface DateRange {
  start: DateTime;
  end: DateTime;
}

export function splitDateRange(
  startDate: DateTime,
  endDate: DateTime,
): DateRange[] {
  const ranges: DateRange[] = [];
  let currentStart = startDate;

  while (currentStart < endDate) {
    const currentEnd = DateTime.min(
      currentStart.plus({ days: MAX_DAYS_PER_REQUEST - 1 }),
      endDate,
    );

    ranges.push({
      start: currentStart,
      end: currentEnd,
    });

    currentStart = currentEnd.plus({ days: 1 });
  }

  return ranges;
}
