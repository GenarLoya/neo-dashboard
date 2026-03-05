export type TNeoGeneralMeasures = {
  asteroidsPerDay: TAsteroidsPerDay;
  totalAsteroids: number;
  dateRange: TDateRange;
};

export type TDateRange = {
  start: string;
  end: string;
  totalDays: number;
};

export type TAsteroidPerDay = {
  date: string;
  asteroidsPerDay: number;
};

export type TAsteroidsPerDay = TAsteroidPerDay[];
