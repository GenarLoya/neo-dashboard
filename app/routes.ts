import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("routes/home/home.tsx"),
  route("graphs", "routes/graphs/graphs.tsx"),
] satisfies RouteConfig;
