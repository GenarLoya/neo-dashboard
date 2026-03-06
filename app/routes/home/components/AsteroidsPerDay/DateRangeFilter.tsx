"use client";

import { CalendarIcon, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useNavigate, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
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

  const handleApplyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      const start = DateTime.fromJSDate(dateRange.from).toFormat("yyyy-MM-dd");
      const end = DateTime.fromJSDate(dateRange.to).toFormat("yyyy-MM-dd");

      navigate(`/?startDate=${start}&endDate=${end}`);
    }
  };

  const handleReset = () => {
    const defaultStart = DateTime.now().minus({ days: 60 }).toJSDate();
    const defaultEnd = DateTime.now().toJSDate();

    setDateRange({
      from: defaultStart,
      to: defaultEnd,
    });

    navigate("/");
  };

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return "Pick a date range";

    if (!range.to) {
      return DateTime.fromJSDate(range.from).toFormat("LLL dd, yyyy");
    }

    return `${DateTime.fromJSDate(range.from).toFormat("LLL dd, yyyy")} - ${DateTime.fromJSDate(range.to).toFormat("LLL dd, yyyy")}`;
  };

  return (
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

      <div className="flex gap-2">
        <Button
          onClick={handleApplyFilter}
          disabled={!dateRange?.from || !dateRange?.to || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Apply Filter
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
      </div>
    </div>
  );
}
