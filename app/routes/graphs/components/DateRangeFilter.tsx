"use client";

import { CalendarIcon, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface DateRangeFilterProps {
  currentStartDate: string;
  currentEndDate: string;
}

export function DateRangeFilter({
  currentStartDate,
  currentEndDate,
}: DateRangeFilterProps) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: DateTime.fromFormat(currentStartDate, "yyyy-MM-dd").toJSDate(),
    to: DateTime.fromFormat(currentEndDate, "yyyy-MM-dd").toJSDate(),
  });

  const MAX_DAYS = 120;

  const calculateDaysDifference = (from: Date, to: Date): number => {
    const start = DateTime.fromJSDate(from);
    const end = DateTime.fromJSDate(to);
    return Math.ceil(end.diff(start, "days").days);
  };

  const isRangeValid =
    dateRange?.from && dateRange?.to
      ? calculateDaysDifference(dateRange.from, dateRange.to) <= MAX_DAYS
      : true;

  const daysDifference =
    dateRange?.from && dateRange?.to
      ? calculateDaysDifference(dateRange.from, dateRange.to)
      : 0;

  const handleApplyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      const start = DateTime.fromJSDate(dateRange.from).toFormat("yyyy-MM-dd");
      const end = DateTime.fromJSDate(dateRange.to).toFormat("yyyy-MM-dd");

      navigate(`/graphs?startDate=${start}&endDate=${end}`);
    }
  };

  const handleReset = () => {
    const defaultStart = DateTime.now().minus({ days: 60 }).toJSDate();
    const defaultEnd = DateTime.now().toJSDate();

    setDateRange({
      from: defaultStart,
      to: defaultEnd,
    });

    navigate("/graphs");
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick a date range";

    if (!range.to) {
      return DateTime.fromJSDate(range.from).toFormat("LLL dd, yyyy");
    }

    return `${DateTime.fromJSDate(range.from).toFormat("LLL dd, yyyy")} - ${DateTime.fromJSDate(range.to).toFormat("LLL dd, yyyy")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Range Filter</CardTitle>
        <CardDescription>
          Select a date range to view Near-Earth Object data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date Range:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-75 justify-start text-left font-normal"
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange(dateRange)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={(date) => date > new Date()}
                  numberOfMonths={2}
                  defaultMonth={dateRange?.from}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              onClick={handleApplyFilter}
              disabled={
                !dateRange?.from || !dateRange?.to || isLoading || !isRangeValid
              }
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Reset
            </Button>
            {!isRangeValid && dateRange?.from && dateRange?.to && (
              <span className="text-sm text-red-500">
                Date range cannot exceed {MAX_DAYS} days. Current selection:{" "}
                {daysDifference} days.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
