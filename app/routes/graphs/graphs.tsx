import { getNeoGeneralMeasures } from "data/neo/getNeoGeneralMeasures.service";
import { Suspense } from "react";
import { Await, useNavigate } from "react-router";
import type { Route } from "./+types/graphs";
import { AsteroidsPerDay } from "./components/AsteroidsPerDay";
import { DateRangeFilter } from "./components/DateRangeFilter";
import { MeasurementsScatter } from "./components/MeasurementsScatter";
import Loader from "../../components/ui/loader";
import { ErrorDisplay } from "../../components/ui/error-display";
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

function GraphsErrorElement() {
  const navigate = useNavigate();

  return (
    <ErrorDisplay
      title="Failed to load asteroid data"
      message="Unable to fetch Near-Earth Object measurements. Please check your connection and try again."
      onRetry={() => navigate(0)}
    />
  );
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <Suspense fallback={<Loader></Loader>}>
        <Await
          resolve={loaderData.getNeoGeneralMeasures}
          errorElement={<GraphsErrorElement />}
        >
          {(data) => (
            <div className="fade-in flex flex-col gap-4 p-4">
              <DateRangeFilter
                currentStartDate={data.dateRange.start}
                currentEndDate={data.dateRange.end}
              />

              <AsteroidsPerDay asteroidsPerDay={data.asteroidsPerDay} />
              <MeasurementsScatter
                measurementsScatter={data.measurementsScatter}
              />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
