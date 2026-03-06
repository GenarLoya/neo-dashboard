export type TNeoGeneralMeasures = {
  asteroidsPerDay: TAsteroidsPerDay;
  totalAsteroids: number;
  dateRange: TDateRange;
  measurementsScatter: TMeasurementsScatter;
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

export type TScatterPoint = {
  name: string; // Asteroid name
  size: number; // Size in meters (average diameter)
  velocity: number; // Velocity in km/h
  isHazardous: number; // Hazard indicator (1 = hazardous, 0 = not hazardous)
  missDistance?: number; // Miss distance in kilometers (optional additional data)
  link: string; // Link to NASA JPL page for the asteroid
  closeApproachDate: string; // Close approach date (YYYY-MM-DD)
};

export type TMeasurementsScatter = TScatterPoint[];
