import { getNeoGeneralMeasures } from "data/neo/getNeoGeneralMeasures.service";
import { Suspense } from "react";
import { Await } from "react-router";
import type { Route } from "./+types/home";
import { AsteroidsPerDay } from "./components/AsteroidsPerDay/AsteroidsPerDay";
import { getHomeSearchParams } from "./searchParams";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = getHomeSearchParams(request.url);

  return {
    getNeoGeneralMeasures: getNeoGeneralMeasures(
      searchParams.startDate,
      searchParams.endDate,
    ),
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Suspense fallback={<div>Loadings...</div>}>
        <Await resolve={loaderData.getNeoGeneralMeasures}>
          {(data) => (
            <>
              <AsteroidsPerDay
                asteroidsPerDay={data.asteroidsPerDay}
                dateRange={data.dateRange}
              />
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
