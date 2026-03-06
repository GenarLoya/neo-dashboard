import { Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import { useNavigation } from "react-router";
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
} from "recharts";
import type {
  TMeasurementsScatter,
  TScatterPoint,
} from "types/neo-data-process.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type ChartConfig, ChartContainer } from "~/components/ui/chart";

const chartConfig = {
  hazardous: {
    label: "Hazardous",
    color: "hsl(0 84% 60%)", // red
  },
  notHazardous: {
    label: "Not Hazardous",
    color: "hsl(142 76% 36%)", // green
  },
} satisfies ChartConfig;

export function MeasurementsScatter({
  measurementsScatter,
}: {
  measurementsScatter: TMeasurementsScatter;
}) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Separate data by hazard status for different scatter series
  const hazardousData = measurementsScatter.filter(
    (point) => point.isHazardous === 1,
  );
  const notHazardousData = measurementsScatter.filter(
    (point) => point.isHazardous === 0,
  );

  const handleDoubleClick = (data: TScatterPoint) => {
    if (data.link) {
      window.open(data.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NEO Size vs Velocity Analysis</CardTitle>
        <CardDescription>
          Relationship between asteroid size (diameter) and velocity, colored by
          hazard status. Double-click any point to view NASA details.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-100 w-full"
        >
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="size"
              name="Size"
              unit=" m"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Diameter (meters)",
                position: "insideBottom",
                offset: -10,
              }}
            />
            <YAxis
              type="number"
              dataKey="velocity"
              name="Velocity"
              unit=" km/h"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Velocity (km/h)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ZAxis
              type="number"
              dataKey="missDistance"
              range={[50, 400]}
              name="Miss Distance"
              unit=" km"
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;

                const data = payload[0].payload;

                return (
                  <div className="rounded-lg border bg-background p-3 shadow-lg">
                    <div className="mb-2">
                      <p className="font-semibold text-sm">{data.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {data.isHazardous ? "Potentially Hazardous" : "Safe"}
                      </p>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Diameter:</span>
                        <span className="font-medium">
                          {data.size.toFixed(2)} m
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Velocity:</span>
                        <span className="font-medium">
                          {data.velocity.toFixed(0)} km/h
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          Miss Distance:
                        </span>
                        <span className="font-medium">
                          {data.missDistance?.toLocaleString()} km
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          Last Close Approach:
                        </span>
                        <span className="font-medium">
                          {DateTime.fromFormat(
                            data.closeApproachDate,
                            "yyyy-MM-dd",
                          ).toFormat("LLL dd, yyyy")}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground italic">
                          Double-click to see details →
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Scatter
              name="Hazardous Asteroids"
              data={hazardousData}
              fill="var(--color-hazardous)"
              shape="circle"
              onDoubleClick={handleDoubleClick}
              style={{ cursor: "pointer" }}
            />
            <Scatter
              name="Non-Hazardous Asteroids"
              data={notHazardousData}
              fill="var(--color-notHazardous)"
              shape="circle"
              onDoubleClick={handleDoubleClick}
              style={{ cursor: "pointer" }}
            />
          </ScatterChart>
        </ChartContainer>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "hsl(0 84% 60%)" }}
            />
            <span className="text-muted-foreground">
              Potentially Hazardous ({hazardousData.length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "hsl(142 76% 36%)" }}
            />
            <span className="text-muted-foreground">
              Not Hazardous ({notHazardousData.length})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
