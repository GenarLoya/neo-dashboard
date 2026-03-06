import { DateTime } from "luxon";
import z from "zod";

const paramsScheme = z.object({
  startDate: z
    .string()
    .optional()
    .default(DateTime.now().minus({ days: 60 }).toFormat("yyyy-MM-dd"))
    .refine((value) => DateTime.fromFormat(value, "yyyy-MM-dd").isValid),
  endDate: z
    .string()
    .optional()
    .default(DateTime.now().toFormat("yyyy-MM-dd"))
    .refine((value) => DateTime.fromFormat(value, "yyyy-MM-dd").isValid),
});

export type THomeSearchParams = z.infer<typeof paramsScheme>;

export const getHomeSearchParams = (url: string) => {
  const params = paramsScheme.parse(
    Object.fromEntries(new URL(url).searchParams),
  );

  return params;
};
