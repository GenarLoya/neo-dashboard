import { describe, expect, it } from "vitest";
import type { TNeoFeedResponse } from "types/neo-feed-response.types";
import { mergeNeoResponses } from "./mergeNeoResponses";

const makeResponse = (
  nearEarthObjects: TNeoFeedResponse["near_earth_objects"],
): TNeoFeedResponse => ({
  links: { next: "", prev: "", self: "" },
  element_count: Object.values(nearEarthObjects).flat().length,
  near_earth_objects: nearEarthObjects,
});

describe("mergeNeoResponses", () => {
  it("should throw when given an empty array", () => {
    expect(() => mergeNeoResponses([])).toThrow("No responses to merge");
  });

  it("should return the same response when given a single item", () => {
    const response = makeResponse({
      "2024-01-01": [{ id: "1" } as any],
    });

    const result = mergeNeoResponses([response]);

    expect(result).toBe(response);
  });

  it("should sum element_count across all responses", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any, { id: "2" } as any] });
    const r2 = makeResponse({ "2024-01-02": [{ id: "3" } as any] });

    const result = mergeNeoResponses([r1, r2]);

    expect(result.element_count).toBe(3);
  });

  it("should merge near_earth_objects from different dates", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any] });
    const r2 = makeResponse({ "2024-01-02": [{ id: "2" } as any] });

    const result = mergeNeoResponses([r1, r2]);

    expect(Object.keys(result.near_earth_objects)).toHaveLength(2);
    expect(result.near_earth_objects["2024-01-01"]).toHaveLength(1);
    expect(result.near_earth_objects["2024-01-02"]).toHaveLength(1);
  });

  it("should concatenate asteroids on the same date from different responses", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any] });
    const r2 = makeResponse({ "2024-01-01": [{ id: "2" } as any, { id: "3" } as any] });

    const result = mergeNeoResponses([r1, r2]);

    expect(result.near_earth_objects["2024-01-01"]).toHaveLength(3);
    expect(result.near_earth_objects["2024-01-01"].map((a) => a.id)).toEqual([
      "1",
      "2",
      "3",
    ]);
  });

  it("should preserve the links from the first response", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any] });
    r1.links = { next: "next-url", prev: "prev-url", self: "self-url" };
    const r2 = makeResponse({ "2024-01-02": [{ id: "2" } as any] });
    r2.links = { next: "other-next", prev: "other-prev", self: "other-self" };

    const result = mergeNeoResponses([r1, r2]);

    expect(result.links).toEqual({ next: "next-url", prev: "prev-url", self: "self-url" });
  });

  it("should correctly merge three or more responses", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any] });
    const r2 = makeResponse({ "2024-01-02": [{ id: "2" } as any] });
    const r3 = makeResponse({ "2024-01-03": [{ id: "3" } as any] });

    const result = mergeNeoResponses([r1, r2, r3]);

    expect(result.element_count).toBe(3);
    expect(Object.keys(result.near_earth_objects)).toHaveLength(3);
  });

  it("should not mutate the original responses", () => {
    const r1 = makeResponse({ "2024-01-01": [{ id: "1" } as any] });
    const r2 = makeResponse({ "2024-01-01": [{ id: "2" } as any] });

    const originalR1Count = r1.element_count;
    mergeNeoResponses([r1, r2]);

    expect(r1.element_count).toBe(originalR1Count);
    expect(r1.near_earth_objects["2024-01-01"]).toHaveLength(1);
  });
});
