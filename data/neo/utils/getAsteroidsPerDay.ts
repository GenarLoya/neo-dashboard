import type { TAsteroidsPerDay } from "types/neo-data-process.type";
import type { TNeoFeedResponse } from "types/neo-feed-response.types";

export function getAsteroidsPerDay(data: TNeoFeedResponse): TAsteroidsPerDay {
  return Object.entries(data.near_earth_objects)
    .map(([date, asteroids]) => ({
      date,
      asteroidsPerDay: asteroids.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
