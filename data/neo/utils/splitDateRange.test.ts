import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { MAX_DAYS_PER_REQUEST } from "../constants";
import { splitDateRange } from "./splitDateRange";

describe("splitDateRange", () => {
  it("should return a single range when the date range fits within MAX_DAYS_PER_REQUEST", () => {
    const start = DateTime.fromISO("2024-01-01");
    const end = DateTime.fromISO("2024-01-07");

    const result = splitDateRange(start, end);

    expect(result).toHaveLength(1);
    expect(result[0].start.toISODate()).toBe("2024-01-01");
    expect(result[0].end.toISODate()).toBe("2024-01-07");
  });

  it("should split into multiple ranges when the date range exceeds MAX_DAYS_PER_REQUEST", () => {
    const start = DateTime.fromISO("2024-01-01");
    const end = start.plus({ days: MAX_DAYS_PER_REQUEST * 2 });

    const result = splitDateRange(start, end);

    expect(result.length).toBeGreaterThan(1);
  });

  it("should have no gaps between consecutive ranges", () => {
    const start = DateTime.fromISO("2024-01-01");
    const end = DateTime.fromISO("2024-04-01");

    const result = splitDateRange(start, end);

    for (let i = 0; i < result.length - 1; i++) {
      const currentEnd = result[i].end;
      const nextStart = result[i + 1].start;
      expect(nextStart.toISODate()).toBe(
        currentEnd.plus({ days: 1 }).toISODate(),
      );
    }
  });

  it("should start the first range on the given start date", () => {
    const start = DateTime.fromISO("2024-03-15");
    const end = DateTime.fromISO("2024-06-01");

    const result = splitDateRange(start, end);

    expect(result[0].start.toISODate()).toBe("2024-03-15");
  });

  it("should end the last range on the given end date", () => {
    const start = DateTime.fromISO("2024-01-01");
    const end = DateTime.fromISO("2024-06-30");

    const result = splitDateRange(start, end);

    expect(result[result.length - 1].end.toISODate()).toBe("2024-06-30");
  });

  it("should return an empty array when start equals end", () => {
    const date = DateTime.fromISO("2024-01-01");

    const result = splitDateRange(date, date);

    expect(result).toHaveLength(0);
  });

  it("each chunk should not exceed MAX_DAYS_PER_REQUEST days", () => {
    const start = DateTime.fromISO("2024-01-01");
    const end = DateTime.fromISO("2024-12-31");

    const result = splitDateRange(start, end);

    for (const range of result) {
      const days = range.end.diff(range.start, "days").days;
      expect(days).toBeLessThanOrEqual(MAX_DAYS_PER_REQUEST - 1);
    }
  });
});
