import type { TNeoFeedResponse } from "types/neo-feed-response.types";
import { describe, expect, it } from "vitest";
import { getAsteroidsPerDay } from "./getAsteroidsPerDay";

const makeFeedResponse = (
  nearEarthObjects: TNeoFeedResponse["near_earth_objects"],
): TNeoFeedResponse => ({
  links: { next: "", prev: "", self: "" },
  element_count: Object.values(nearEarthObjects).flat().length,
  near_earth_objects: nearEarthObjects,
});

describe("getAsteroidsPerDay", () => {
  it("should return one entry per date", () => {
    const response = makeFeedResponse({
      "2024-01-01": [{ id: "1" } as any],
      "2024-01-02": [{ id: "2" } as any, { id: "3" } as any],
    });

    const result = getAsteroidsPerDay(response);

    expect(result).toHaveLength(2);
  });

  it("should correctly count asteroids per day", () => {
    const response = makeFeedResponse({
      "2024-01-01": [{ id: "1" } as any, { id: "2" } as any],
      "2024-01-02": [{ id: "3" } as any],
    });

    const result = getAsteroidsPerDay(response);
    const jan1 = result.find((r) => r.date === "2024-01-01");
    const jan2 = result.find((r) => r.date === "2024-01-02");

    expect(jan1?.asteroidsPerDay).toBe(2);
    expect(jan2?.asteroidsPerDay).toBe(1);
  });

  it("should return results sorted by date ascending", () => {
    const response = makeFeedResponse({
      "2024-01-05": [{ id: "3" } as any],
      "2024-01-01": [{ id: "1" } as any],
      "2024-01-03": [{ id: "2" } as any],
    });

    const result = getAsteroidsPerDay(response);

    expect(result[0].date).toBe("2024-01-01");
    expect(result[1].date).toBe("2024-01-03");
    expect(result[2].date).toBe("2024-01-05");
  });

  it("should return an empty array when there are no near earth objects", () => {
    const response = makeFeedResponse({});

    const result = getAsteroidsPerDay(response);

    expect(result).toHaveLength(0);
  });

  it("should handle a single date with a single asteroid", () => {
    const response = makeFeedResponse({
      "2024-06-15": [{ id: "42" } as any],
    });

    const result = getAsteroidsPerDay(response);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ date: "2024-06-15", asteroidsPerDay: 1 });
  });

  it("should include the date field in every entry", () => {
    const response = makeFeedResponse({
      "2024-01-01": [{ id: "1" } as any],
      "2024-01-02": [{ id: "2" } as any],
    });

    const result = getAsteroidsPerDay(response);

    for (const entry of result) {
      expect(entry).toHaveProperty("date");
      expect(entry).toHaveProperty("asteroidsPerDay");
    }
  });
});
