import { DateTime } from "luxon";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useNavigation } from "react-router";
import type { TAsteroidsPerDay, TDateRange } from "types/neo-data-process.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { DateRangeFilter } from "./DateRangeFilter";

const chartConfig = {
  asteroidsPerDay: {
    label: "Asteroids",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function AsteroidsPerDay({
  asteroidsPerDay,
  dateRange,
}: {
  asteroidsPerDay: TAsteroidsPerDay;
  dateRange: TDateRange;
}) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5">
        <div className="flex items-center justify-between gap-2">
          <div className="grid flex-1 gap-1">
            <CardTitle>Asteroids Per Day</CardTitle>
            <CardDescription>
              Showing total asteroids per day from {dateRange.start} to{" "}
              {dateRange.end}
            </CardDescription>
          </div>
        </div>
        <DateRangeFilter
          currentStartDate={dateRange.start}
          currentEndDate={dateRange.end}
        />
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
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={asteroidsPerDay}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return DateTime.fromFormat(value, "yyyy-MM-dd").toFormat(
                      "LLL dd",
                    );
                  }}
                  indicator="dashed"
                />
              }
            />
            <Area
              dataKey="asteroidsPerDay"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
