import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/root-layout/root-layout.tsx", [
    index("routes/home/home.tsx"),
    route("graphs", "routes/graphs/graphs.tsx"),
  ]),
] satisfies RouteConfig;
