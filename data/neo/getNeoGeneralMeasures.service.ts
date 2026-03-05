import { DateTime } from "luxon";
import type { TNeoGeneralMeasures } from "types/neo-data-process.type";
import { MAX_TOTAL_DAYS } from "./constants";
import { fetchNeoData } from "./utils/fetchNeoData";
import { getAsteroidsPerDay } from "./utils/getAsteroidsPerDay";
import { mergeNeoResponses } from "./utils/mergeNeoResponses";
import { splitDateRange } from "./utils/splitDateRange";

export async function getNeoGeneralMeasures(
  startDate: string,
  endDate: string,
): Promise<TNeoGeneralMeasures> {
  const startDateDate = DateTime.fromFormat(startDate, "yyyy-MM-dd");
  const endDateDate = DateTime.fromFormat(endDate, "yyyy-MM-dd");

  if (!startDateDate.isValid || !endDateDate.isValid) {
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  if (endDateDate < startDateDate) {
    throw new Error("End date must be after start date");
  }

  const totalDays = endDateDate.diff(startDateDate, "days").days;

  if (totalDays > MAX_TOTAL_DAYS) {
    throw new Error(
      `Date range cannot exceed ${MAX_TOTAL_DAYS} days. Requested: ${Math.ceil(totalDays)} days`,
    );
  }

  const dateRanges = splitDateRange(startDateDate, endDateDate);

  const responses = await fetchNeoData(dateRanges);

  const mergedData = mergeNeoResponses(responses);

  return {
    asteroidsPerDay: getAsteroidsPerDay(mergedData),
    totalAsteroids: mergedData.element_count,
    dateRange: {
      start: startDate,
      end: endDate,
      totalDays: Math.ceil(totalDays),
    },
  };
}
