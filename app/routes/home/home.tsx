import { getNeoGeneralMeasures } from "data/neo/getNeoGeneralMeasures.service";
import { Suspense } from "react";
import { Await } from "react-router";
import type { Route } from "./+types/home";
import { AsteroidsPerDay } from "./components/AsteroidsPerDay";
import { getHomeSearchParams } from "./searchParams";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = getHomeSearchParams(request.url);

  return {
    getNeoGeneralMeasures: await getNeoGeneralMeasures(
      searchParams.startDate,
      searchParams.endDate,
    ),
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <Suspense fallback={<div>Loadings...</div>}>
        <Await resolve={loaderData.getNeoGeneralMeasures}>
          {(data) => (
            <AsteroidsPerDay
              asteroidsPerDay={data.asteroidsPerDay}
              dateRange={data.dateRange}
            ></AsteroidsPerDay>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
