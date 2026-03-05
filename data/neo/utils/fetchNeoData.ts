import api from "lib/axios";
import type { TNeoFeedResponse } from "types/neo-feed-response.types";
import type { DateRange } from "./splitDateRange";

export async function fetchNeoData(
  dateRanges: DateRange[],
): Promise<TNeoFeedResponse[]> {
  const responses = await Promise.all(
    dateRanges.map(({ start, end }) =>
      api.get<TNeoFeedResponse>(`/neo/rest/v1/feed`, {
        params: {
          start_date: start.toFormat("yyyy-MM-dd"),
          end_date: end.toFormat("yyyy-MM-dd"),
        },
      }),
    ),
  );

  return responses.map((r) => r.data);
}
