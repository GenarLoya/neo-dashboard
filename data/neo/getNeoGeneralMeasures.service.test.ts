import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TNearEarthObject, TNeoFeedResponse } from "types/neo-feed-response.types";
import { MAX_TOTAL_DAYS } from "./constants";
import { getNeoGeneralMeasures } from "./getNeoGeneralMeasures.service";

// ─── Mock fetchNeoData ────────────────────────────────────────────────────────

vi.mock("./utils/fetchNeoData", () => ({
  fetchNeoData: vi.fn(),
}));

import { fetchNeoData } from "./utils/fetchNeoData";

const mockedFetchNeoData = vi.mocked(fetchNeoData);

// ─── Factories ────────────────────────────────────────────────────────────────

function makeAsteroid(overrides: Partial<TNearEarthObject> = {}): TNearEarthObject {
  return {
    links: { self: "https://api.nasa.gov/neo/1" },
    id: "1",
    neo_reference_id: "1",
    name: "Asteroid (2024 AA)",
    nasa_jpl_url: "https://ssd.jpl.nasa.gov/",
    absolute_magnitude_h: 22.1,
    estimated_diameter: {
      kilometers: { estimated_diameter_min: 0.05, estimated_diameter_max: 0.1 },
      meters: { estimated_diameter_min: 50, estimated_diameter_max: 100 },
      miles: { estimated_diameter_min: 0.03, estimated_diameter_max: 0.06 },
      feet: { estimated_diameter_min: 164, estimated_diameter_max: 328 },
    },
    is_potentially_hazardous_asteroid: false,
    is_sentry_object: false,
    close_approach_data: [
      {
        close_approach_date: "2024-01-01",
        close_approach_date_full: "2024-Jan-01 12:00",
        epoch_date_close_approach: 1704067200000,
        relative_velocity: {
          kilometers_per_second: "10",
          kilometers_per_hour: "36000",
          miles_per_hour: "22369",
        },
        miss_distance: {
          astronomical: "0.1",
          lunar: "38.9",
          kilometers: "14959787",
          miles: "9296252",
        },
        orbiting_body: "Earth",
      },
    ],
    ...overrides,
  };
}

function makeFeedResponse(
  nearEarthObjects: TNeoFeedResponse["near_earth_objects"],
): TNeoFeedResponse {
  return {
    links: { next: "", prev: "", self: "" },
    element_count: Object.values(nearEarthObjects).flat().length,
    near_earth_objects: nearEarthObjects,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getNeoGeneralMeasures", () => {
  beforeEach(() => {
    mockedFetchNeoData.mockResolvedValue([
      makeFeedResponse({
        "2024-01-01": [makeAsteroid({ id: "1" })],
        "2024-01-02": [makeAsteroid({ id: "2" }), makeAsteroid({ id: "3" })],
      }),
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Input validation ────────────────────────────────────────────────────────

  describe("input validation", () => {
    it("should throw when startDate has an invalid format", async () => {
      await expect(
        getNeoGeneralMeasures("01-01-2024", "2024-01-07"),
      ).rejects.toThrow("Invalid date format. Expected format: YYYY-MM-DD");
    });

    it("should throw when endDate has an invalid format", async () => {
      await expect(
        getNeoGeneralMeasures("2024-01-01", "not-a-date"),
      ).rejects.toThrow("Invalid date format. Expected format: YYYY-MM-DD");
    });

    it("should throw when both dates have invalid formats", async () => {
      await expect(
        getNeoGeneralMeasures("bad-start", "bad-end"),
      ).rejects.toThrow("Invalid date format. Expected format: YYYY-MM-DD");
    });

    it("should throw when endDate is before startDate", async () => {
      await expect(
        getNeoGeneralMeasures("2024-01-10", "2024-01-01"),
      ).rejects.toThrow("End date must be after start date");
    });

    it("should throw when date range exceeds MAX_TOTAL_DAYS", async () => {
      const startDate = "2024-01-01";
      const endDate = "2024-07-01"; // ~182 days, well over 120

      await expect(
        getNeoGeneralMeasures(startDate, endDate),
      ).rejects.toThrow(`Date range cannot exceed ${MAX_TOTAL_DAYS} days`);
    });

    it("should include the requested days in the max range error message", async () => {
      await expect(
        getNeoGeneralMeasures("2024-01-01", "2024-07-01"),
      ).rejects.toThrow("Requested:");
    });

    it("should not throw when date range is exactly MAX_TOTAL_DAYS", async () => {
      const startDate = "2024-01-01";
      const endDate = "2024-05-01"; // exactly 121 days — use 120 to be safe
      const exactEnd = "2024-04-30"; // 120 days from 2024-01-01

      await expect(
        getNeoGeneralMeasures(startDate, exactEnd),
      ).resolves.not.toThrow();
    });
  });

  // ── Return shape ────────────────────────────────────────────────────────────

  describe("return shape", () => {
    it("should return an object with the expected keys", async () => {
      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result).toHaveProperty("asteroidsPerDay");
      expect(result).toHaveProperty("totalAsteroids");
      expect(result).toHaveProperty("dateRange");
      expect(result).toHaveProperty("measurementsScatter");
    });

    it("should return the startDate and endDate in the dateRange", async () => {
      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.dateRange.start).toBe("2024-01-01");
      expect(result.dateRange.end).toBe("2024-01-07");
    });

    it("should correctly compute totalDays in the dateRange", async () => {
      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-11");

      expect(result.dateRange.totalDays).toBe(10);
    });

    it("should return totalDays of 0 when start and end are the same date", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({ "2024-06-15": [makeAsteroid()] }),
      ]);

      const result = await getNeoGeneralMeasures("2024-06-15", "2024-06-15");

      expect(result.dateRange.totalDays).toBe(0);
    });

    it("should set totalAsteroids from the merged element_count", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [makeAsteroid({ id: "1" }), makeAsteroid({ id: "2" })],
          "2024-01-02": [makeAsteroid({ id: "3" })],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.totalAsteroids).toBe(3);
    });

    it("should sum totalAsteroids across multiple fetched chunks", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({ "2024-01-01": [makeAsteroid({ id: "1" })] }),
        makeFeedResponse({
          "2024-01-08": [makeAsteroid({ id: "2" }), makeAsteroid({ id: "3" })],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-14");

      expect(result.totalAsteroids).toBe(3);
    });
  });

  // ── asteroidsPerDay ─────────────────────────────────────────────────────────

  describe("asteroidsPerDay", () => {
    it("should return one entry per date in the response", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [makeAsteroid({ id: "1" })],
          "2024-01-02": [makeAsteroid({ id: "2" })],
          "2024-01-03": [makeAsteroid({ id: "3" })],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.asteroidsPerDay).toHaveLength(3);
    });

    it("should return asteroidsPerDay sorted ascending by date", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-05": [makeAsteroid()],
          "2024-01-01": [makeAsteroid()],
          "2024-01-03": [makeAsteroid()],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");
      const dates = result.asteroidsPerDay.map((e) => e.date);

      expect(dates).toEqual(["2024-01-01", "2024-01-03", "2024-01-05"]);
    });

    it("should count the correct number of asteroids per day", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [makeAsteroid({ id: "1" }), makeAsteroid({ id: "2" })],
          "2024-01-02": [makeAsteroid({ id: "3" })],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");
      const jan1 = result.asteroidsPerDay.find((e) => e.date === "2024-01-01");
      const jan2 = result.asteroidsPerDay.find((e) => e.date === "2024-01-02");

      expect(jan1?.asteroidsPerDay).toBe(2);
      expect(jan2?.asteroidsPerDay).toBe(1);
    });
  });

  // ── measurementsScatter ─────────────────────────────────────────────────────

  describe("measurementsScatter", () => {
    it("should return a scatter point for each asteroid with close approach data", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [makeAsteroid({ id: "1" }), makeAsteroid({ id: "2" })],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter).toHaveLength(2);
    });

    it("should exclude asteroids without close approach data", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [
            makeAsteroid({ id: "1" }),
            makeAsteroid({ id: "2", close_approach_data: [] }),
          ],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter).toHaveLength(1);
    });

    it("should mark hazardous asteroids with isHazardous = 1", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [
            makeAsteroid({ id: "1", is_potentially_hazardous_asteroid: true }),
          ],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter[0].isHazardous).toBe(1);
    });

    it("should mark non-hazardous asteroids with isHazardous = 0", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [
            makeAsteroid({ id: "1", is_potentially_hazardous_asteroid: false }),
          ],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter[0].isHazardous).toBe(0);
    });

    it("should calculate average diameter correctly", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [
            makeAsteroid({
              estimated_diameter: {
                kilometers: { estimated_diameter_min: 0, estimated_diameter_max: 0 },
                meters: { estimated_diameter_min: 40, estimated_diameter_max: 60 },
                miles: { estimated_diameter_min: 0, estimated_diameter_max: 0 },
                feet: { estimated_diameter_min: 0, estimated_diameter_max: 0 },
              },
            }),
          ],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter[0].size).toBe(50);
    });

    it("should parse velocity as a number from the string in the API response", async () => {
      mockedFetchNeoData.mockResolvedValue([
        makeFeedResponse({
          "2024-01-01": [makeAsteroid()],
        }),
      ]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(typeof result.measurementsScatter[0].velocity).toBe("number");
      expect(result.measurementsScatter[0].velocity).toBe(36000);
    });

    it("should parse missDistance as a number from the string in the API response", async () => {
      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(typeof result.measurementsScatter[0].missDistance).toBe("number");
    });

    it("should return an empty array when no asteroids are present", async () => {
      mockedFetchNeoData.mockResolvedValue([makeFeedResponse({})]);

      const result = await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(result.measurementsScatter).toHaveLength(0);
    });
  });

  // ── fetchNeoData integration ─────────────────────────────────────────────────

  describe("fetchNeoData integration", () => {
    it("should call fetchNeoData once", async () => {
      await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      expect(mockedFetchNeoData).toHaveBeenCalledTimes(1);
    });

    it("should pass date ranges to fetchNeoData", async () => {
      await getNeoGeneralMeasures("2024-01-01", "2024-01-07");

      const [dateRanges] = mockedFetchNeoData.mock.calls[0];
      expect(dateRanges.length).toBeGreaterThan(0);
      expect(dateRanges[0]).toHaveProperty("start");
      expect(dateRanges[0]).toHaveProperty("end");
    });

    it("should propagate errors thrown by fetchNeoData", async () => {
      mockedFetchNeoData.mockRejectedValue(new Error("Network error"));

      await expect(
        getNeoGeneralMeasures("2024-01-01", "2024-01-07"),
      ).rejects.toThrow("Network error");
    });
  });
});
