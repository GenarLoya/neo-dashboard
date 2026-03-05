import type { TNeoFeedResponse } from "types/neo-feed-response.types";

export function mergeNeoResponses(
  responses: TNeoFeedResponse[],
): TNeoFeedResponse {
  if (responses.length === 0) {
    throw new Error("No responses to merge");
  }

  if (responses.length === 1) {
    return responses[0];
  }

  const merged: TNeoFeedResponse = {
    links: responses[0].links,
    element_count: 0,
    near_earth_objects: {},
  };

  for (const response of responses) {
    merged.element_count += response.element_count;

    for (const [date, asteroids] of Object.entries(
      response.near_earth_objects,
    )) {
      if (merged.near_earth_objects[date]) {
        // Merge asteroids for the same date (shouldn't happen with proper chunking, but just in case)
        merged.near_earth_objects[date] = [
          ...merged.near_earth_objects[date],
          ...asteroids,
        ];
      } else {
        merged.near_earth_objects[date] = asteroids;
      }
    }
  }

  return merged;
}
