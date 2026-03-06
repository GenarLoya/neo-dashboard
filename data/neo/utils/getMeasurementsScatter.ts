import type { TMeasurementsScatter } from "types/neo-data-process.type";
import type { TNeoFeedResponse } from "types/neo-feed-response.types";

export function getMeasurementsScatter(
  data: TNeoFeedResponse,
): TMeasurementsScatter {
  // Flatten all asteroids from all dates into a single array
  const allAsteroids = Object.values(data.near_earth_objects).reduce(
    (acc, asteroids) => acc.concat(asteroids),
    [],
  );

  // Transform each asteroid into a scatter point
  const scatterPoints = allAsteroids
    // # Filter out asteroids without close approach data
    .filter((asteroid) => asteroid.close_approach_data?.length)
    .map((asteroid) => {
      // Calculate average diameter in meters
      const minDiameter =
        asteroid.estimated_diameter.meters.estimated_diameter_min;
      const maxDiameter =
        asteroid.estimated_diameter.meters.estimated_diameter_max;
      const avgDiameter = (minDiameter + maxDiameter) / 2;

      // Get the first close approach data (most relevant)
      const [closeApproach] = asteroid.close_approach_data;

      const velocity = parseFloat(
        closeApproach.relative_velocity.kilometers_per_hour,
      );

      const isHazardous = asteroid.is_potentially_hazardous_asteroid ? 1 : 0;

      const missDistance = parseFloat(closeApproach.miss_distance.kilometers);

      return {
        name: asteroid.name,
        size: avgDiameter,
        velocity,
        isHazardous,
        missDistance,
        link: asteroid.links.self,
        closeApproachDate: closeApproach.close_approach_date,
      };
    });

  return scatterPoints;
}
