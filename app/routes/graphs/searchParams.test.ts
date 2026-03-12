import { describe, expect, it } from "vitest";
import { DateTime } from "luxon";
import { getHomeSearchParams } from "./searchParams";

const makeUrl = (params: Record<string, string> = {}) => {
  const url = new URL("http://localhost:3000/graphs");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
};

describe("getHomeSearchParams", () => {
  it("should return default dates when no params are provided", () => {
    const result = getHomeSearchParams(makeUrl());

    const expectedStart = DateTime.now().minus({ days: 60 }).toFormat("yyyy-MM-dd");
    const expectedEnd = DateTime.now().toFormat("yyyy-MM-dd");

    expect(result.startDate).toBe(expectedStart);
    expect(result.endDate).toBe(expectedEnd);
  });

  it("should return the provided startDate and endDate", () => {
    const result = getHomeSearchParams(
      makeUrl({ startDate: "2024-01-01", endDate: "2024-03-01" }),
    );

    expect(result.startDate).toBe("2024-01-01");
    expect(result.endDate).toBe("2024-03-01");
  });

  it("should use the provided startDate and fall back to default endDate", () => {
    const expectedEnd = DateTime.now().toFormat("yyyy-MM-dd");

    const result = getHomeSearchParams(makeUrl({ startDate: "2024-01-01" }));

    expect(result.startDate).toBe("2024-01-01");
    expect(result.endDate).toBe(expectedEnd);
  });

  it("should use the provided endDate and fall back to default startDate", () => {
    const expectedStart = DateTime.now().minus({ days: 60 }).toFormat("yyyy-MM-dd");

    const result = getHomeSearchParams(makeUrl({ endDate: "2024-06-01" }));

    expect(result.startDate).toBe(expectedStart);
    expect(result.endDate).toBe("2024-06-01");
  });

  it("should throw when startDate has an invalid format", () => {
    expect(() =>
      getHomeSearchParams(makeUrl({ startDate: "01-01-2024", endDate: "2024-03-01" })),
    ).toThrow();
  });

  it("should throw when endDate has an invalid format", () => {
    expect(() =>
      getHomeSearchParams(makeUrl({ startDate: "2024-01-01", endDate: "not-a-date" })),
    ).toThrow();
  });

  it("should throw when both dates have invalid formats", () => {
    expect(() =>
      getHomeSearchParams(makeUrl({ startDate: "bad", endDate: "alsoBad" })),
    ).toThrow();
  });

  it("should accept dates at year boundaries", () => {
    const result = getHomeSearchParams(
      makeUrl({ startDate: "2023-12-31", endDate: "2024-01-01" }),
    );

    expect(result.startDate).toBe("2023-12-31");
    expect(result.endDate).toBe("2024-01-01");
  });

  it("should accept the same date for startDate and endDate", () => {
    const result = getHomeSearchParams(
      makeUrl({ startDate: "2024-06-15", endDate: "2024-06-15" }),
    );

    expect(result.startDate).toBe("2024-06-15");
    expect(result.endDate).toBe("2024-06-15");
  });

  it("should ignore unrelated query params", () => {
    const result = getHomeSearchParams(
      makeUrl({ startDate: "2024-01-01", endDate: "2024-03-01", foo: "bar" }),
    );

    expect(result.startDate).toBe("2024-01-01");
    expect(result.endDate).toBe("2024-03-01");
    expect(result).not.toHaveProperty("foo");
  });
});
